require('dotenv').config();

const oracledb = require("oracledb")
const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cors = require('cors')

const app = express();
const PORT = 3000;
const SECRET_KEY = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

// JWT 토큰 검증
function authenticateToken(req, res, next){
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).send("인증 토큰이 필요합니다.");
    }
    
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if(err){
            return res.status(403).send("유효하지 않은 토큰입니다.");
        }

        req.user = user;
        next();
    });
}

//데이터베이스 연결 함수
async function connectToDatabase(){     
    try{
        const connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT_STRING
        });

        console.log("성공적으로 DB에 연결했습니다.");
        return connection;
    }catch(err){
        console.error("DB 연결 실패: ",err);
        return null;
    }
}

//Connection닫기함수
async function closeConnection(connection) {
    if(connection){
        try{
            await connection.close();
        }catch(err){
            console.error("DB 연결 닫기 실패: ",err);
        }
    }
}

//회원가입
app.post("/auth/register", async (req, res) => {
    const {user_id, password, nickname} = req.body;
    let connection
    try{
        connection = await connectToDatabase();
        
        const hashedPassword = await bcrypt.hash(password, 10);

        await connection.execute(
            "INSERT INTO TABLE_USER (USER_ID, PASSWORD, NICKNAME) VALUES (:user_id, :password, :nickname)",
            {user_id, password: hashedPassword, nickname},
            {autoCommit: true}
        );
        res.status(201).send("회원가입이 완료되었습니다.");
    }catch(err){
        console.error(err);
        res.status(500).send("회원가입 중 오류가 발생했습니다.");
    }finally{
        if(connection){
            await closeConnection(connection);
        }
    }
});

//로그인
app.post("/auth/login", async(req, res) => {
    const {user_id, password} = req.body;
    let connection;
    try{
        connection = await connectToDatabase();
        if(!connection){
            return res.status(500).send("DB 연결에 실패했습니다.");
        }

        const result = await connection.execute(
            "SELECT USER_ID, PASSWORD, NICKNAME FROM TABLE_USER WHERE USER_ID = :user_id",
            {user_id}
            );
        if(result.rows.length === 0){
            return res.status(401).send("로그인 실패: 잘못된 ID 또는 비밀번호 입니다.");
        }

        const [dbUserId, hashedPassword, nickname] = result.rows[0];

        const isPasswordValid = await bcrypt.compare(password, hashedPassword);
        if(!isPasswordValid){
            return res.status(401).send("로그인 실패: 잘못된 ID 또는 비밀번호 입니다.");
        }
        
        const accessToken = jwt.sign(
            {user_id: dbUserId, nickname: nickname},
            SECRET_KEY,
            {expiresIn: "7d"}
        );

        res.status(201).json({ accessToken });
    }catch(err){
        console.error(err);
        res.status(500).send("로그인 중 오류가 발생했습니다.");
    }finally{
        await closeConnection(connection);
    }
});

//------------홈화면 관련 API
// 사용자가 속한 프로젝트 조회(홈화면 프로젝트 목록 띄울때 사용)
app.get("/home/my", authenticateToken, async (req, res) => {
    const { user_id } = req.user;
    let connection;
    try{
        connection = await connectToDatabase();
        const result = await connection.execute(
            "SELECT P.PROJ_ID, P.PROJ_NAME, P.LEADER_ID FROM TABLE_PROJECT P JOIN TABLE_USER_PROJ UP ON P.PROJ_ID = UP.PROJ_ID WHERE UP.USER_ID = :user_id",
            { user_id }
        );
        res.json(result.rows);
    }catch(err){
        console.error(err);
        res.status(500).send("프로젝트 조회 중 오류가 발생했습니다.");
    }finally{
        await closeConnection(connection);
    }
});

//사용자 닉네임 변경
app.put("/auth/mynickname", authenticateToken, async(req, res) => {
    const {user_id} = req.user;
    const {nickname} = req.body;
    let connection;
    if(!nickname || nickname.trim() === ""){
        return res.status(400).send("닉네임은 비어 있을 수 없습니다.");
    }
    try{
        connection = await connectToDatabase();
        if(!connection){
            return res.status(500).send("DB 연결에 실패했습니다");
        }
        
        const result = await connection.execute(
            "UPDATE TABLE_USER SET NICKNAME = :nickname WHERE USER_ID = :user_id",
            {nickname, user_id},
            {autoCommit: true}
        );
        
        if(result.rowsAffected == 0){
            return res.status(404).send("사용자를 찾을 수 없습니다.");
        }
        res.status(200).send("닉네임이 성공적으로 변경 되었습니다.");
        
    }catch(err){
        console.error(err);
        res.status(500).send("닉네임 변경 중 오류가 발생했습니다.");
    }finally{
        await closeConnection(connection);
    }
});

//팀 프로젝트 생성
app.post("/home/newprojects", authenticateToken, async (req, res) => {
    const leader_id = req.user.user_id;
    const { proj_name } = req.body;
    let connection;
    try {
        connection = await connectToDatabase();
        if (!connection) {
            return res.status(500).send("DB 연결에 실패했습니다.");
        }

        const result = await connection.execute(
            "INSERT INTO TABLE_PROJECT (PROJ_NAME, LEADER_ID) VALUES (:proj_name, :leader_id) RETURNING PROJ_ID INTO :proj_id",
            { proj_name, leader_id, proj_id: {type:oracledb.NUMBER, dir: oracledb.BIND_OUT} },
            { autoCommit: true }
        );

        // PROJ_ID를 다시 조회
        // const queryResult = await connection.execute(
        //     "SELECT PROJ_ID FROM TABLE_PROJECT WHERE ROWID = :rowid",
        //     { rowid: result.lastRowid } // lastRowid로 최근 입력된 행 식별
        // );

        const createdProjId = result.outBinds.proj_id[0];

        if (!createdProjId) {
            await connection.rollback();
            return res.status(500).send("프로젝트 ID를 가져오는 데 실패했습니다.");
        }

        await connection.execute(
            "INSERT INTO TABLE_USER_PROJ (USER_ID, PROJ_ID) VALUES (:leader_id, :proj_id)",
            {leader_id, proj_id:createdProjId}
        );

        await connection.commit();

        res.status(201).json({
            message: "프로젝트가 성공적으로 생성되었습니다.",
            proj_id: createdProjId,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("프로젝트 생성 중 오류가 발생했습니다.");
    } finally {
        await closeConnection(connection);
    }
});


// app.post("/home/newprojects", authenticateToken, async (req, res) => {
//     const leader_id = req.user.user_id;
//     const { proj_name } = req.body;
//     let connection;
//     try{
//         connection = await connectToDatabase();
//         if(!connection){
//             return res.status(500).send("DB 연결에 실패했습니다.");
//         }

//         const result = await connection.execute(
//             "INSERT INTO TABLE_PROJECT (PROJ_NAME, LEADER_ID) VALUES (:proj_name, :leader_id) RETURNING PROJ_ID INTO :proj_id",
//             { proj_name, leader_id },
//             { autoCommit: true }
//         );

//         const createProjId = result.outBinds.proj_id[0];

//         res.status(201).json({message : "프로젝트가 성공적으로 생성되었습니다.", proj_id: createProjId});
//     }catch(err){
//         console.error(err);
//         res.status(500).send("프로젝트 생성 중 오류가 발생했습니다.");
//     }finally{
//         await closeConnection(connection);
//     }
// });



//------------프로젝트 화면 관련 API
//팀 프로젝트 멤버 조회 (프로젝트 홈화면에서 표기)
app.get("/projects/:proj_id", authenticateToken, async (req, res) => {
    const { proj_id } = req.params;
    let connection;
    try{
        connection = await connectToDatabase();
        if(!connection){
            return res.status(500).send("DB 연결에 실패했습니다.");
        }

        const result = await connection.execute(
            "SELECT U.USER_ID, U.NICKNAME FROM TABLE_USER U JOIN TABLE_USER_PROJ UP ON U.USER_ID = UP.USER_ID WHERE UP.PROJ_ID = :proj_id",
            { proj_id }
        );
        res.json(result.rows);
    }catch(err){
        console.error(err);
        res.status(500).send("프로젝트 멤버 조회 중 오류가 발생했습니다.");
    }finally{
        await closeConnection(connection);
    }
});

//팀원 초대
app.post("/projects/:proj_id/invite", authenticateToken, async (req,res) => {
    const {proj_id} = req.params;
    const {user_id} = req.body;
    let connection;
    try{
        connection = await connectToDatabase();
        if(!connection){
            return res.status(500).send("DB 연결에 실패했습니다.");
        }

        const userCheck = await connection.execute(
            "SELECT * FROM TABLE_USER WHERE USER_ID = :user_id",
            {user_id}
        );
        if(userCheck.rows.length === 0){
            return res.status(400).send("존재하지 않는 사용자 입니다.")
        }

        const memberCheck = await connection.execute(
            "SELECT * FROM TABLE_USER_PROJ WHERE USER_ID = :user_id AND PROJ_ID = :proj_id",
            {user_id, proj_id}
        );

        if(memberCheck.rows.length > 0){
            return res.status(400).send("사용자는 이미 팀원입니다.");
        }

        await connection.execute(
            "INSERT INTO TABLE_USER_PROJ (USER_ID, PROJ_ID) VALUES (:user_id, :proj_id)",
            {user_id, proj_id},
            {autoCommit: true}
        );
        res.status(201).send("팀원이 성공적으로 초대되었습니다.");
    }catch(err){
        console.error(err);
        res.status(500).send("팀원 초대 중 오류가 발생했습니다.");
    }finally{
        await closeConnection(connection);
    }
});

//프로젝트 조회
// app.get("/projects/my", authenticateToken, async (req, res) => {
//     const {user_id} = req.user;
//     let connection;
//     try{
//         connection = await connectToDatabase();
//         const result = await connection.execute(
//             "SELECT P.PROJ_ID, P.PROJ_NAME, P.LEADER_ID FROM PROJECT P JOIN USER_PROJ UP ON P.PROJ_ID WHERE UP.USER_ID = :user_id"
//         );
//         res.json(result.rows);
//     }catch(err){
//         console.error(err);
//         res.status(500).send("프로젝트 조회 중 오류가 발생했습니다.");
//     }finally{
//         if(connection){
//             try{
//                 await connection.close();
//             }catch(err){
//                 console.error(err);
//             }
//         }
//     }
// });

//스케쥴 등록

app.post("/projects/:proj_id/addschedule", authenticateToken, async(req, res) => {
    const { proj_id } = req.params;
    const { time, date_meet } = req.body;
    const { user_id } = req.user;
    let connection;
    try {
        connection = await connectToDatabase();
        if(!connection) {
            return res.status(500).send("DB 연결에 실패했습니다.");
        }

        // 기존 스케줄 조회
        const result = await connection.execute(
            "SELECT * FROM TABLE_SCHEDULE WHERE PROJ_ID = :proj_id AND USER_ID = :user_id AND DATE_MEET = TO_DATE(:date_meet, 'YYYY-MM-DD')",
            { proj_id, user_id, date_meet }
        );

        if (result.rows && result.rows.length > 0) {
            // 기존 스케줄이 있으면 update
            await connection.execute(
                "UPDATE TABLE_SCHEDULE SET TIME = :time WHERE PROJ_ID = :proj_id AND USER_ID = :user_id AND DATE_MEET = TO_DATE(:date_meet, 'YYYY-MM-DD')",
                { time, proj_id, user_id, date_meet },
                { autoCommit: true }
            );
            res.status(200).send("스케줄이 성공적으로 업데이트되었습니다.");
        } else {
            // 기존 스케줄이 없으면 insert
            await connection.execute(
                "INSERT INTO TABLE_SCHEDULE (PROJ_ID, USER_ID, TIME, DATE_MEET) VALUES (:proj_id, :user_id, :time, TO_DATE(:date_meet, 'YYYY-MM-DD'))",
                { proj_id, user_id, time, date_meet },
                { autoCommit: true }
            );
            res.status(201).send("스케줄이 성공적으로 등록되었습니다.");
        }
    } catch(err) {
        console.error(err);
        res.status(500).send("스케줄 등록 또는 업데이트 중 오류가 발생했습니다.");
    } finally {
        await closeConnection(connection);
    }
});

//스케쥴 조회(스케쥴화면 띄울때)//수정필요
app.get("/projects/:proj_id/schedules", authenticateToken, async (req, res) => {
    const { proj_id } = req.params;
    const { start_day, end_day } = req.query;      //한 주의 시작과 끝
    let connection;
    try{
        connection = await connectToDatabase();
        if(!connection){
            return res.status(500).send("DB 연결에 실패했습니다.");
        }

        if (!start_day || !end_day) {
            return res.status(400).send("start_day와 end_day는 필수 입력값입니다.");
        }

        const result = await connection.execute(
            "SELECT SCHEDULE_ID, USER_ID, TIME, DATE_MEET FROM TABLE_SCHEDULE WHERE PROJ_ID = :proj_id AND DATE_MEET BETWEEN TO_DATE(:start_day || ' 00:00:00', 'YYYY-MM-DD HH24:MI:SS') AND TO_DATE(:end_day || ' 23:59:59', 'YYYY-MM-DD HH24:MI:SS')",
            {proj_id, start_day, end_day}
        );
        res.json(result.rows);
    }catch(err){
        console.error(err);
        res.status(500).send("스케쥴 조회 중 오류가 발생했습니다.");
    }finally{
        await closeConnection(connection);
    }
});

//나의 스케쥴 조회(스케쥴화면 띄울때)
app.get("/projects/:proj_id/myschedules", authenticateToken, async (req, res) => {
    const { proj_id } = req.params;
    const { start_day, end_day } = req.query;      //한 주의 시작과 끝
    const { user_id } = req.user;
    let connection;
    try{
        connection = await connectToDatabase();
        if(!connection){
            return res.status(500).send("DB 연결에 실패했습니다.");
        }

        if (!start_day || !end_day) {
            return res.status(400).send("start_day와 end_day는 필수 입력값입니다.");
        }

        const result = await connection.execute(
            "SELECT SCHEDULE_ID, USER_ID, TIME, DATE_MEET FROM TABLE_SCHEDULE WHERE PROJ_ID = :proj_id AND DATE_MEET BETWEEN TO_DATE(:start_day || ' 00:00:00', 'YYYY-MM-DD HH24:MI:SS') AND TO_DATE(:end_day || ' 23:59:59', 'YYYY-MM-DD HH24:MI:SS') AND USER_ID = :user_id",
            {proj_id, start_day, end_day, user_id}
        );
        res.json(result.rows);
    }catch(err){
        console.error(err);
        res.status(500).send("스케쥴 조회 중 오류가 발생했습니다.");
    }finally{
        await closeConnection(connection);
    }
});

//스케쥴 수정 만들것
// app.put("/projects/:proj_id/scheduleUpdate", authenticateToken, async (req, res) => {
//     const { proj_id } = req.params;
//     const { user_id } = req.user;
//     const { new_time, date_meet } = req.body;      //한 주의 시작과 끝
//     let connection;
//     try{
//         connection = await connectToDatabase();
//         if(!connection){
//             return res.status(500).send("DB 연결에 실패했습니다.");
//         }

//         if (!date_meet || !new_time) {
//             return res.status(400).send("date_meet, new_time은 필수 입력값입니다.");
//         }

//         const result = await connection.execute(
//             "UPDATE TABLE_SCHEDULE SET TIME = :new_time WHERE PROJ_ID = :proj_id AND USER_ID = :user_id AND DATE_MEET = TO_DATE(:date_meet, 'YYYY-MM-DD')",
//             {proj_id, user_id, date_meet, new_time},
//             {autoCommit: true}
//         );

//         if (result.rowsAffected === 0) {
//             return res.status(404).send("해당하는 스케줄을 찾을 수 없습니다.");
//         }
//         res.status(201).send("스케쥴 수정이 완료 되었습니다.");
//     }catch(err){
//         console.error(err);
//         res.status(500).send("스케쥴 수정 중 오류가 발생했습니다.");
//     }finally{
//         await closeConnection(connection);
//     }
// });


//미팅 만들기
app.post("/projects/:proj_id/schedule/makeMeet", authenticateToken, async(req, res) => {
    const { proj_id } = req.params;
    const {task_name="미팅", duedate, isdone=2} = req.body;
    let connection;
    try{
        connection = await connectToDatabase();
        if(!connection){
            return res.status(500).send("DB 연결에 실패했습니다.");
        }
        const result = await connection.execute(
            "INSERT INTO TABLE_TASK (PROJ_ID, TASK_NAME, DUEDATE, ISDONE) VALUES (:proj_id, :task_name, TO_DATE(:duedate, 'YYYY-MM-DD HH24:MI'), :isdone) RETURNING TASK_ID INTO :task_id",
            //"INSERT INTO TABLE_SCHEDULE (PROJ_ID, SCHEDULE_ID, USER_ID, START_TIME, END_TIME) VALUES (:proj_id, :schedule_id, :user_id, TO_DATE(:start_time, 'YYYY-MM-DD HH24:MI'), TO_DATE(:end_time, 'YYYY-MM-DD HH24:MI'))",
            {proj_id, task_name, duedate, isdone, task_id: {type:oracledb.NUMBER, dir: oracledb.BIND_OUT}},
            {autoCommit:false}
        );

        const createdTaskId = result.outBinds.task_id[0];

        if (!createdTaskId) {
            await connection.rollback();
            return res.status(500).send("태스크 ID를 가져오는 데 실패했습니다.");
        }



        await connection.commit();

        res.status(201).send("미팅이 성공적으로 등록되었습니다.");
    }catch(err){
        console.error(err);
        res.status(500).send("미팅이 등록 중 오류가 발생했습니다.");
    }finally{
        await closeConnection(connection);
    }
});

//---------------TASK화면 캘린더 클릭 전
//Task생성
app.post("/projects/:proj_id/tasks/make", authenticateToken, async (req, res) => {
    const {proj_id} = req.params;
    const {task_name, duedate, isdone = '0', user_ids} = req.body;
    let connection;
    try{
        connection = await connectToDatabase();
        if(!connection){
            return res.status(500).send("DB 연결에 실패했습니다.");
        }

        const result = await connection.execute(
            "INSERT INTO TABLE_TASK (PROJ_ID, TASK_NAME, DUEDATE, ISDONE) VALUES (:proj_id, :task_name, TO_DATE(:duedate, 'YYYY-MM-DD'), :isdone) RETURNING TASK_ID INTO :task_id",
            { proj_id, task_name, duedate, isdone, task_id: {type:oracledb.NUMBER, dir: oracledb.BIND_OUT}},
            { autoCommit: false }
        );

        const createdTaskId = result.outBinds.task_id[0];

        if (!createdTaskId) {
            await connection.rollback();
            return res.status(500).send("태스크 ID를 가져오는 데 실패했습니다.");
        }

        //배열순회 추가
        for(const user_id of user_ids){
            await connection.execute(
                "INSERT INTO TABLE_TASK_USER (TASK_ID, USER_ID) VALUES (:task_id, :user_id)",
                {task_id:createdTaskId, user_id}
            );
        }

        await connection.commit();

        res.status(201).send("Task가 성공적으로 생성되었습니다.");
    }catch(err){
        console.error(err);
        res.status(500).send("Task 생성 중 오류가 발생했습니다.");
    }finally{
        await closeConnection(connection);
    }
});

//Task완료
app.post("/projects/:proj_id/tasks/isdone", authenticateToken, async (req, res) => {
    const {proj_id} = req.params;
    const {task_id} = req.body;
    let connection;
    try{
        connection = await connectToDatabase();
        if(!connection){
            return res.status(500).send("DB 연결에 실패했습니다.");
        }

        const result = await connection.execute(
            "UPDATE TABLE_TASK SET ISDONE = 1 WHERE PROJ_ID = :proj_id AND TASK_ID=:task_id",
            { proj_id, task_id},
            { autoCommit: true }
        );

        if(result.rowsAffected === 0){
            return res.status(404).send("해당 TASK를 찾을 수 없습니다.")
        }

        res.status(200).send("Task가 성공적으로 완료처리 되었습니다.");
    }catch(err){
        console.error(err);
        res.status(500).send("Task 완료 처리 중 오류가 발생했습니다.");
    }finally{
        await closeConnection(connection);
    }
});

//Task조회
app.get("/projects/:proj_id/tasks", authenticateToken, async (req, res) => {
    const {proj_id} = req.params;
    let connection;
    try{
        connection = await connectToDatabase();
        if(!connection){
            return res.status(500).send("DB 연결에 실패했습니다.");
        }

        const result = await connection.execute(
            "SELECT t.TASK_ID, t.TASK_NAME, t.DUEDATE, t.ISDONE, u.USER_ID FROM TABLE_TASK t LEFT JOIN TABLE_TASK_USER u ON t.TASK_ID = u.TASK_ID WHERE t.PROJ_ID = :proj_id",
            {proj_id}
        );

        console.log("쿼리 결과:",result.rows);

        const tasks = {};
        result.rows.forEach(row => {
            const taskId = row[0];  // TASK_ID는 첫 번째 열입니다.

            if (!tasks[taskId]) {
                tasks[taskId] = {
                    taskId: row[0],
                    taskName: row[1],
                    dueDate: row[2],
                    isDone: row[3],
                    userIds: []
                };
            }
            
            if (row[4]) {  // USER_ID는 다섯 번째 열입니다.
                tasks[taskId].userIds.push(row[4]);
            }
        });

        const response = Object.values(tasks);
        res.json(response);
        
    }catch(err){
        console.error(err);
        res.status(500).send("Task 조회 중 오류가 발생했습니다.");
    }finally{
        await closeConnection(connection);
    }
});

//Task수정
app.put("/projects/:proj_id/tasks/modify", authenticateToken, async (req, res) => {
    const {proj_id} = req.params;
    const {task_id, task_name, duedate, user_ids} = req.body;

    let connection;
    try{
        connection = await connectToDatabase();
        if(!connection){
            return res.status(500).send("DB 연결에 실패했습니다.");
        }

        if (!task_name || task_name.trim() === "") {
            return res.status(400).send("유효한 TASK_NAME을 입력하세요.");
        }
        
        if (!duedate || duedate.trim() === "") {
            return res.status(400).send("유효한 DUEDATE를 입력하세요.");
        }

        const result = await connection.execute(
            "UPDATE TABLE_TASK SET TASK_NAME = :task_name, DUEDATE = TO_DATE(:duedate, 'YYYY-MM-DD') WHERE PROJ_ID = :proj_id AND TASK_ID = :task_id",
            {task_name, duedate, proj_id, task_id},
            {autoCommit: false}
        );

        if(result.rowsAffected === 0){
            return res.status(404).send("해당 TASK를 찾을 수 없습니다.")
        }

        await connection.execute(
            "DELETE FROM TABLE_TASK_USER WHERE TASK_ID = :task_id",
            { task_id }
        );

        for(const user_id of user_ids){
            await connection.execute(
                "INSERT INTO TABLE_TASK_USER (TASK_ID, USER_ID) VALUES (:task_id, :user_id)",
                {task_id,user_id}
            );
        };

        await connection.commit();

        res.status(200).send("TASK가 성공적으로 수정되었습니다.");
    }catch(err){
        console.error(err);
        if(connection){
            await connection.rollback();
        }
        res.status(500).send("TASK 수정 중 오류가 발생했습니다.");
    }finally{
        await closeConnection(connection);
    }
});


//------------알림관련
//모든 알림 알림 조회
app.get("/home/notifications", authenticateToken, async(req, res) => {
    const { user_id } = req.user;
    let connection;
    try{
        connection = await connectToDatabase();
        if(!connection){
            return res.status(500).send("DB 연결에 실패했습니다.");
        }

        const result = await connection.execute(
            "SELECT PROJ_ID, NOTICE_ID, MESSAGE, DUEDATE FROM TABLE_NOTICE WHERE USER_ID = :user_id",
            { user_id }
        );
        res.json(result.rows);
    }catch(err){
        console.error(err);
        res.status(500).send("알림 조회 중 오류가 발생했습니다.");
    }finally{
        await closeConnection(connection);
    }
});

//알림 전송(알림 생성과 같이 사용)
app.post("/projects/:proj_id/makeNotification", authenticateToken, async (req, res) => {
    const { message, user_ids } = req.body;
    const { proj_id } = req.params;
    let connection;

    const today = new Date();
    const kstOffset = 9 * 60 * 60 * 1000; // 한국 표준시는 UTC+9
    const kstDate = new Date(today.getTime() + kstOffset);
    const duedate = kstDate.toISOString().split('T')[0];

    try{
        connection = await connectToDatabase();
        if(!connection){
            return res.status(500).send("DB 연결에 실패했습니다.");
        }

        for(const user_id of user_ids){
            await connection.execute(
                "INSERT INTO TABLE_NOTICE (USER_ID, PROJ_ID, MESSAGE, DUEDATE) VALUES (:user_id, :proj_id, :message, TO_DATE(:duedate, 'YYYY-MM-DD'))",
                { user_id, proj_id, message, duedate },
                { autoCommit: false }
            );
        }

        await connection.commit();

        res.status(201).send("알림이 성공적으로 전송되었습니다.");
    }catch(err){
        console.error(err);
        res.status(500).send("알림 전송 중 오류가 발생했습니다.");
    }finally{
        await closeConnection(connection);
    }
});

//팀 프로젝트 알림 조회 (프로젝트 홈화면 알림 클릭 시)
app.get("/projects/:proj_id/notifications", authenticateToken, async(req, res) => {
    const { proj_id } = req.params;
    const { user_id } = req.user;
    let connection;
    try{
        connection = await connectToDatabase();
        if(!connection){
            return res.status(500).send("DB 연결에 실패했습니다.");
        }

        const result = await connection.execute(
            "SELECT NOTICE_ID, MESSAGE, DUEDATE FROM TABLE_NOTICE WHERE PROJ_ID = :proj_id AND USER_ID = :user_id",
            { proj_id, user_id }
        );
        res.json(result.rows);
    }catch(err){
        console.error(err);
        res.status(500).send("알림 조회 중 오류가 발생했습니다.");
    }finally{
        await closeConnection(connection);
    }
});




app.listen(PORT,()=>{
    console.log("서버가 실행중입니다.");
});
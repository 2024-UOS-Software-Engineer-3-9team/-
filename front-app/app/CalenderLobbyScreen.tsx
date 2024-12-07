import { CheckBoxIcon } from "./icons/CheckBoxIcon"; // CheckBoxIcon import
import { ArrowBackIcon } from "./icons/ArrowBackIcon"; // ArrowBackIcon import
import { ArrowForwardIcon } from "./icons/ArrowForwardIcon"; // ArrowForwardIcon import
import { CalendarTodayIcon } from "./icons/CalendarTodayIcon"; // CalendarTodayIcon import
import { CheckBoxOutlineBlankIcon } from "./icons/CheckBoxOutlineBlankIcon"; // CheckBoxOutlineBlankIcon import
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Box, Button, Checkbox, IconButton, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";

interface CalenderLobbyScreenProps {
  onCalenderPress: () => void;
  onProjectLobbyPress: () => void;
  onSchedulePress: () => void;
  onGenerateTaskPress: () => void;
  onDateCellClick: (date: number, event: React.MouseEvent) => void;
}


const CalenderLobbyScreen: React.FC<CalenderLobbyScreenProps> = ({ 
  onCalenderPress,
  onProjectLobbyPress,
  onSchedulePress,
  onGenerateTaskPress,
  onDateCellClick,
}) => {
  const [clickedDate, setClickedDate] = useState(null);
  const OndateCellClick = (date, event) => {
    setClickedDate(date); // 클릭한 날짜 상태 업데이트
    console.log(`날짜: ${date}, 클릭 이벤트: `, event); // 클릭한 날짜와 이벤트 정보 출력
  };

  const [activeTab, setActiveTab] = useState<"캘린더" | "구성원" | "스케쥴">("캘린더");

    // 날짜 클릭 시 호출되는 함수
    const handleCellClick = (date: number, event: React.MouseEvent) => {
      setClickedDate(date); // 클릭한 날짜 상태 업데이트
      console.log(`날짜: ${date}, 클릭 이벤트: `, event); // 클릭된 날짜와 이벤트 정보 출력
      onDateCellClick(date, event); // 부모에게 클릭한 날짜 전달
    };
    
  return (
    <Box                        //전체 파란색 배경
      sx={{
        backgroundColor: "#4d9cff",
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Box                  // Java Jpanel같은 느낌으로 바깥 부분.
        sx={{
          backgroundColor: "#4d9cff",
          overflow: "hidden",
          width: 360,
          height: 800,
          left : 130,
          position: "relative",
        }}
      >
          <Typography       //프로젝트 이름
            variant="h3"
            sx={{
              position: "absolute",
              top: 51,
              left: 24,
              color: "white",
              fontWeight: "bold",
            }}
          >
            일조매 개발
          </Typography>
          
        <Box           
          sx={{
            position: "absolute",
            width: 312,
            height: 777,
            top: 124,
            left: 24,
          }}
        >
          <Box     //여기가 흰색 배경임.
            sx={{
              position: "absolute",
              width: 312,
              height: 621,
              top: 0,
              left: 0,
              backgroundColor: "white",
            }}
          />
           <Box              //상단 날짜 이동 구역 (양 버튼과 날짜)
          sx={{ position: "absolute", width: 278, height: 29, top: 240, left: 0 }}
        >
          <Typography
            variant="h6"
            sx={{
              position: "absolute",
              top: 0,
              left: 105,
              fontWeight: "bold",
              color: "black",
            }}
          >
            11월 3째주
          </Typography>
          <IconButton
            sx={{
              position: "absolute",
              top: 5,
              left: 220,
              width: 20,
              height: 20,
              backgroundColor: "#4d9cff",
              borderRadius: 1,
            }}
          >
            <ArrowForwardIcon sx={{ color: "white" }} />
          </IconButton>
          <IconButton
            sx={{
              position: "absolute",
              top: 5,
              left: 60,
              width: 20,
              height: 20,
              backgroundColor: "#4d9cff",
              borderRadius: 1,
            }}
          >
            <ArrowBackIcon sx={{ color: "white" }} />
          </IconButton>
           </Box>
          <Box        //Ongoing 텍스트배치 구역
            sx={{
              position: "absolute",
              width: 312,
              height: 634,
              top: 450,
              left: 0,
            }}
          >
            <Box    //Ongoing 텍스트배치 관련
              sx={{
                display: "flex",
                flexDirection: "column",
                width: 312,
                alignItems: "start",
                gap: 1,
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              <Box    //Ongoing 텍스트배치 관련
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2.5,
                  px: 2.5,
                  py: 0,
                  width: "100%",
                }}
              >
                <CalendarTodayIcon sx={{ width: 26, height: 26 }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "black" }}
                >
                  OnGoing
                </Typography>
              </Box>

              <Box     // Ongoing의 각 멤버 정보 관련 저장한 박스
                sx={{ display: "flex", flexDirection: "column", width: "100%" }}
              >
                <Box        //Task, 완료 버튼 그룹 1
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 2.5,
                      py: 0,
                      width: "90%",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: "bold", color: "black" }}
                    >
                      Task 1
                    </Typography>
                    <Box sx={{ flexGrow: 0.3 }} />
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "black",
                        color: "white",
                        fontSize: 10,
                        fontWeight: "bold",
                      }}
                    >
                      완료
                    </Button>
                </Box>
                <Box        //Task, 완료 버튼 그룹 2
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 2.5,
                      py: 0,
                      width: "90%",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: "bold", color: "black" }}
                    >
                      Task 2
                    </Typography>
                    <Box sx={{ flexGrow: 0.3 }} />
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "black",
                        color: "white",
                        fontSize: 10,
                        fontWeight: "bold",
                      }}
                    >
                      완료
                    </Button>
                </Box>
                <Box        //Task, 완료 버튼 그룹 3
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 2.5,
                      py: 0,
                      width: "90%",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: "bold", color: "black" }}
                    >
                      Task 3
                    </Typography>
                    <Box sx={{ flexGrow: 0.3 }} />
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "black",
                        color: "white",
                        fontSize: 10,
                        fontWeight: "bold",
                      }}
                    >
                      완료
                    </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ position: "relative", width: 214, height: 53, top: 400, left: 35 }} //Notice board     //다음 미팅 관련 구역
          >
            <Typography      //제목
              variant="h6"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                fontWeight: "bold",
                color: "black",
              }}
            >
              Notice
            </Typography>
            <Typography       //공지 1
              sx={{
                position: "absolute",
                top: 30,
                left: 0,
                fontWeight: "bold",
                color: "black",
              }}
            >
              Notice1
            </Typography>
            <Typography        //공지 1 상세 내용
              sx={{
                position: "absolute",
                top: 55,
                left: 0,
                color: "black",
                fontSize: "0.8rem", // 글자 크기를 작게 설정
              }}
            >
              apple

            </Typography>
            <Typography       //공지 2
              sx={{
                position: "absolute",
                top: 80,
                left: 0,
                fontWeight: "bold",
                color: "black",
              }}
            >
              Notice1
            </Typography>
            <Typography        //공지 2 상세 내용
              sx={{
                position: "absolute",
                top: 105,
                left: 0,
                color: "black",
                fontSize: "0.8rem", // 글자 크기를 작게 설정
              }}
            >
              apple

            </Typography>
            <Typography       //공지 3
              sx={{
                position: "absolute",
                top: 130,
                left: 0,
                fontWeight: "bold",
                color: "black",
              }}
            >
              Notice1
            </Typography>
            <Typography        //공지 3 상세 내용
              sx={{
                position: "absolute",
                top: 155,
                left: 0,
                color: "black",
                fontSize: "0.8rem", // 글자 크기를 작게 설정
              }}
            >
              apple

            </Typography>

        </Box>
        <Box        //Task 만들기 버튼을 붙일 패널
          sx={{ position: "absolute", width: 158, height: 28, top: 708, left: 93 }}
        >
          <Button   //Task 만들기 버튼
            variant="contained"
            sx={{
              width: 156,
              height: 28,
              backgroundColor: "#4d9cff",
              borderRadius: 1,
            }}
            onClick={() => {
              onGenerateTaskPress();}
            }
          >
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              Task 만들기
            </Typography>
          </Button>
        </Box>
        <Box     //하단 바 완성
          sx={{
            position: 'absolute',
            width: 361,
            height: 36,
            top: 765,
            left: 0,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Button
            variant="contained"
            sx={{
              width: 120,
              height: 36,
              backgroundColor: activeTab === '캘린더' ? '#4d9cff' : 'white',
              borderRadius: 1,
            }}
            onClick={() => {
              setActiveTab('캘린더');
              onCalenderPress();}
            }
          >
            <Typography variant="h6" sx={{ color: activeTab === '캘린더' ? 'white' : 'black', fontWeight: 'bold' }}>
              캘린더
            </Typography>
          </Button>
          <Button
            variant="contained"
            sx={{
              width: 120,
              height: 36,
              backgroundColor: activeTab === '구성원' ? '#4d9cff' : 'white',
              borderRadius: 1,
            }}            
            onClick={() => {
              setActiveTab('구성원');
              onProjectLobbyPress();}
            }
          >
            <Typography variant="h6" sx={{ color: activeTab === '구성원' ? 'white' : 'black', fontWeight: 'bold' }}>
              구성원
            </Typography>
          </Button>
          <Button
            variant="contained"
            sx={{
              width: 120,
              height: 36,
              backgroundColor: activeTab === '스케쥴' ? '#4d9cff' : 'white',
              borderRadius: 1,
            }}
            onClick={() => {
              setActiveTab('스케쥴');
              onSchedulePress();}
            }
          >
            <Typography variant="h6" sx={{ color: activeTab === '스케쥴' ? 'white' : 'black', fontWeight: 'bold' }}>
              스케쥴
            </Typography>
          </Button>
        </Box>
      </Box>
      <Box     //하단 바 완성
          sx={{
            position: 'relative',
            width: 300,
            height: 230,
            top: 130,
            left: -200,
            display: 'flex',
            justifyContent: 'space-between',
          }}
          >
        <Table sx={{ 
          position: "relative",
          width: '100%', 
          height: '100%', 
          tableLayout: 'fixed', 
          border: '1px solid black',
          top: 0, 
          left: 0,
          zIndex: 10,
          overflow: 'auto', 
          }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '10%', border: '1px solid black',padding: '1.5px', }}>날짜</TableCell> {/* 날짜 헤더*/}
                  <TableCell sx={{ width: '90%', border: '1px solid black',padding: '1.5px',}}>Task 내용</TableCell> {/* Task 내용 헤더 */}
                </TableRow>
              </TableHead>
              <TableBody>
                {/* 해당 부분 수정하여 Task 내용 및 날짜 넣어야 함 */}
                {[...Array(7)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell
                      sx={{
                        width: '10%',
                        border: '1px solid black',
                        padding: '2px',  // 셀의 세로 길이를 작게 설정
                        cursor: 'pointer', 
                        '&:hover': {
                          fontWeight: 'bold', 
                        },
                      }}
                      onClick={(event) => OndateCellClick(index + 1, event)} // 클릭 시 날짜와 이벤트 넘기기
                    >
                      {index + 1} {/* 날짜 표시 */}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: '1px solid black',
                        padding: '2px',  // 셀의 세로 길이를 작게 설정
                      }}
                    >
                      {/* 각 Task 내용 */}
                      {index === 0 ? '' : `Task 내용 ${index}`} 
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
    </Box>
  );
};

export default CalenderLobbyScreen;

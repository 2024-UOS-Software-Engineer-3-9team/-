import { CheckBoxIcon } from "./icons/CheckBoxIcon"; // CheckBoxIcon import
import { ArrowBackIcon } from "./icons/ArrowBackIcon"; // ArrowBackIcon import
import { ArrowForwardIcon } from "./icons/ArrowForwardIcon"; // ArrowForwardIcon import
import { CalendarTodayIcon } from "./icons/CalendarTodayIcon"; // CalendarTodayIcon import
import { CheckBoxOutlineBlankIcon } from "./icons/CheckBoxOutlineBlankIcon"; // CheckBoxOutlineBlankIcon import
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Box, Button, Checkbox, IconButton, Typography } from "@mui/material";
import React from "react";

interface CalenderLobbyScreenProps {
  onBackPress: () => void;
}

const CalenderLobbyScreen: React.FC<CalenderLobbyScreenProps> = ({ onBackPress }) => {
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
            11월 14일
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
          >
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              Task 만들기
            </Typography>
          </Button>
        </Box>
        <Box         //캘린더 하단 바 
            sx={{
              position: "absolute",
              width: 361,
              height: 36,
              top: 765,
              left: 0,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="contained"
              sx={{
                width: 120,
                height: 36,
                backgroundColor: "#4d9cff",
                borderRadius: 1,
                pointerEvents: "none"
              }}
              disabled={true}
            >
              <Typography
                variant="h6"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                캘린더
              </Typography>
            </Button>
            <Button
              variant="contained"
              sx={{
                width: 120,
                height: 36,
                backgroundColor: "white",
                borderRadius: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "black", fontWeight: "bold" }}
              >
                구성원
              </Typography>
            </Button>
            <Button
              variant="contained"
              sx={{
                width: 120,
                height: 36,
                backgroundColor: "white",
                borderRadius: 1,
              }}
              >
              <Typography
                variant="h6"
                sx={{ color: "black", fontWeight: "bold" }}
              >
                스케쥴
              </Typography>
            </Button>
        </Box>
      </Box>
      <Table sx={{ position: "absolute",width: '30%', tableLayout: 'fixed', border: '1px solid black',top: 150, left: 325,}}>
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
                    }}
                  >
                    {/* (2,1)부터 (8,1)까지 날짜 표시 */}
                    {index}
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
  );
};

export default CalenderLobbyScreen;

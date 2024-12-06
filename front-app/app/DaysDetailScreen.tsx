import { CheckBoxIcon } from "./icons/CheckBoxIcon"; // CheckBoxIcon import
import { ArrowBackIcon } from "./icons/ArrowBackIcon"; // ArrowBackIcon import
import { ArrowForwardIcon } from "./icons/ArrowForwardIcon"; // ArrowForwardIcon import
import { CalendarTodayIcon } from "./icons/CalendarTodayIcon"; // CalendarTodayIcon import
import { CheckBoxOutlineBlankIcon } from "./icons/CheckBoxOutlineBlankIcon"; // CheckBoxOutlineBlankIcon import

import { Box, Button, Checkbox, IconButton, Typography } from "@mui/material";
import React from "react";

interface DaysDetailScreenProps {
  onBackPress: () => void;
}

const DaysDetailScreen: React.FC<DaysDetailScreenProps> = ({ onBackPress }) => {
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
        <Box           //여기가 흰색 배경임
          sx={{
            position: "absolute",
            width: 312,
            height: 777,
            top: 124,
            left: 24,
          }}
        >
          <Box       //Ongoing 배치 구역
            sx={{
              position: "absolute",
              width: 312,
              height: 621,
              top: 0,
              left: 0,
              backgroundColor: "white",
            }}
          />

          <Box        //Ongoing 텍스트배치 구역
            sx={{
              position: "absolute",
              width: 312,
              height: 634,
              top: 143,
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
                <Box        //사람, 체크박스, 독촉하기 버튼 그룹 1
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
                      유지호
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Checkbox
                      icon={<CheckBoxOutlineBlankIcon />}
                      checkedIcon={<CheckBoxIcon />}
                    />
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "black",
                        color: "white",
                        fontSize: 10,
                        fontWeight: "bold",
                      }}
                    >
                      독촉하기
                    </Button>
                </Box>
                <Box      //사람, 체크박스, 독촉하기 버튼 그룹 2
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
                    구효근
                  </Typography>
                  <Box sx={{ flexGrow: 1 }} />
                  <Checkbox
                    icon={<CheckBoxOutlineBlankIcon />}
                    checkedIcon={<CheckBoxIcon />}
                  />
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "black",
                      color: "white",
                      fontSize: 10,
                      fontWeight: "bold",
                    }}
                  >
                    독촉하기
                  </Button>
                </Box>
                <Box      //사람, 체크박스, 독촉하기 버튼 그룹 3
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
                    김나린
                  </Typography>
                  <Box sx={{ flexGrow: 1 }} />
                  <Checkbox
                    icon={<CheckBoxOutlineBlankIcon />}
                    checkedIcon={<CheckBoxIcon />}
                  />
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "black",
                      color: "white",
                      fontSize: 10,
                      fontWeight: "bold",
                    }}
                  >
                    독촉하기
                  </Button>
                </Box>
              </Box>
            </Box>

            <Box   //Completed Text 구역
              sx={{
                display: "flex",
                flexDirection: "column",
                width: 312,
                alignItems: "start",
                gap: 1,
                position: "absolute",
                top: 248,
                left: 0,
              }}
            >
              <Box // Completed text 표기용
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
                  Completed
                </Typography>
              </Box>

              <Box  // Completed 세부 항목
                sx={{ display: "flex", flexDirection: "column", width: "100%" }}
              >
                <Box  //세부 항목이 들어가는 박스 
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <Box   //세부 항목 1
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2.5,
                      px: 2.5,
                      py: 0,
                      width: "100%",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        color: "black",
                        textDecoration: "line-through",
                      }}
                    >
                      미팅 잡기
                    </Typography>
                  </Box>

                  <Box    //세부 항목 2
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 2.5,
                      py: 0,
                      width: "100%",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        color: "black",
                        textDecoration: "line-through",
                      }}
                    >
                      유지호
                    </Typography>
                  </Box>

                  <Box    //세부 항목 3
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 2.5,
                      py: 0,
                      width: "100%",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        color: "black",
                        textDecoration: "line-through",
                      }}
                    >
                      유지호
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                  </Box>

                  <Box    //세부 항목 4
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 2.5,
                      py: 0,
                      width: "100%",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        color: "black",
                        textDecoration: "line-through",
                      }}
                    >
                      유지호
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                  </Box>
                  <Box sx={{ flexGrow: 1 }} //기타 세팅
                  /> 
                  </Box>
                </Box>
            </Box>
          </Box>
        </Box>
        <Box              //상단 날짜 이동 구역 (양 버튼과 날짜)
          sx={{ position: "absolute", width: 278, height: 29, top: 140, left: 40 }}
        >
          <Typography
            variant="h4"
            sx={{
              position: "absolute",
              top: 0,
              left: 55,
              fontWeight: "bold",
              color: "black",
            }}
          >
            11월 14일
          </Typography>
          <IconButton
            sx={{
              position: "absolute",
              top: 8,
              left: 245,
              width: 31,
              height: 28,
              backgroundColor: "#4d9cff",
              borderRadius: 1,
            }}
          >
            <ArrowForwardIcon sx={{ color: "white" }} />
          </IconButton>
          <IconButton
            sx={{
              position: "absolute",
              top: 8,
              left: 0,
              width: 31,
              height: 28,
              backgroundColor: "#4d9cff",
              borderRadius: 1,
            }}
          >
            <ArrowBackIcon sx={{ color: "white" }} />
          </IconButton>
        </Box>
        <Box sx={{ position: "relative", width: 214, height: 53, top: 190, left: 35 }}     //다음 미팅 관련 구역
          >
            <Typography
              variant="h6"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                fontWeight: "bold",
                color: "black",
              }}
            >
              다음 미팅
            </Typography>
            <Typography       //다음 미팅 날짜
              variant="h6"
              sx={{
                position: "absolute",
                top: 30,
                left: 0,
                fontWeight: "bold",
                color: "black",
              }}
            >
              11월 27일 오후 3시
            </Typography>
            <Button     //관리 버튼
              variant="contained"
              sx={{
                position: "absolute",
                top: 4,
                left: 100,
                width: 48,
                height: 23,
                backgroundColor: "#4d9cff",
                borderRadius: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                관리
              </Typography>
            </Button>
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
    </Box>
  );
};

export default DaysDetailScreen;

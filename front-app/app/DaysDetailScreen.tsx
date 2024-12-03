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
    <Box
      sx={{
        backgroundColor: "#4d9cff",
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#4d9cff",
          overflow: "hidden",
          width: 360,
          height: 800,
          position: "relative",
        }}
      >
        <Box           //여기가 흰색 배경임
          sx={{
            position: "absolute",
            width: 312,
            height: 777,
            top: 124,
            left: 24,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: 312,
              height: 621,
              top: 0,
              left: 0,
              backgroundColor: "white",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              width: 312,
              height: 634,
              top: 143,
              left: 0,
            }}
          >
            <Box
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
              <Box
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

              <Box
                sx={{ display: "flex", flexDirection: "column", width: "100%" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "90%",
                  }}
                >
                  <Box
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
                      sx={{ fontWeight: "bold", color: "black" }}
                    >
                      자료 조사
                    </Typography>
                  </Box>

                  <Box
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
                </Box>

                <Box
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

                <Box
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

            <Box
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
              <Box
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

              <Box
                sx={{ display: "flex", flexDirection: "column", width: "100%" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <Box
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

                  <Box
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
                </Box>

                <Box
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
                    구효근
                  </Typography>
                  <Box sx={{ flexGrow: 1 }} />
                </Box>

                <Box
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
                    김나린
                  </Typography>
                  <Box sx={{ flexGrow: 1 }} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{ position: "absolute", width: 158, height: 28, top: 708, left: 93 }}
        >
          <Button
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

        <Box
          sx={{ position: "absolute", width: 214, height: 53, top: 190, left: 35 }}
        >
          <Box sx={{ width: 218, height: 53 }}>
            <Box sx={{ position: "relative", width: 214, height: 53 }}>
              <Typography
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
              <Button
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
          </Box>
        </Box>

        <Box
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

          <Typography
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
              }}
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

import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  AppBar,
  Toolbar,
  Avatar,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GroupIcon from "@mui/icons-material/Group";
import ScheduleIcon from "@mui/icons-material/Schedule";

interface CalanderLobbyScreenProps {
  onBackPress: () => void;
}

const CalenderLobbyScreen: React.FC<CalanderLobbyScreenProps> = ({ onBackPress }) => {
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
          width: 360,
          height: 800,
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 313,
            height: 619,
            top: 124,
            left: 24,
            backgroundColor: "white",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: 312,
              height: 619,
              top: 0,
              left: 0,
              backgroundColor: "white",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: 158,
              height: 28,
              top: 579,
              left: 70,
              backgroundColor: "#4d9cff",
              borderRadius: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Inter-SemiBold, Helvetica",
                fontWeight: "bold",
                color: "white",
              }}
            >
              Task 만들기
            </Typography>
          </Box>
          <Box
            sx={{
              position: "absolute",
              width: 278,
              height: 28,
              top: 200,
              left: 55,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                sx={{
                  width: 31,
                  height: 28,
                  backgroundColor: "#4d9cff",
                  borderRadius: 1,
                }}
              >
                <ArrowBackIosIcon sx={{ color: "white" }} />
              </IconButton>
              <Typography
              variant="h6"
              sx={{
                fontFamily: "Inter-SemiBold, Helvetica",
                fontWeight: "bold",
                color: "black",
              }}
            >
              11월 3주차
            </Typography>
              <IconButton
                sx={{
                  width: 31,
                  height: 28,
                  backgroundColor: "#4d9cff",
                  borderRadius: 1,
                }}
              >
                <ArrowForwardIosIcon sx={{ color: "white" }} />
              </IconButton>
            </Box>
          </Box>
          <Box
            sx={{
              position: "absolute",
              width: 312,
              height: 132,
              top: 370,
              left: 0,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar src="/image-11.png" sx={{ width: 20, height: 20, left: 10 }} alt="Image" />
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Inter-SemiBold, Helvetica",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Ongoing Task
              </Typography>
            </Box>
            <List>
              {["자료 조사", "자료 조사", "자료 조사", "자료 조사"].map((task, index) => (
                <ListItem 
                key={index}
                sx={{
                  paddingY: 0.3, // 세로 패딩을 줄여서 길이 감소
                  paddingLeft: 2, // 좌측 패딩 조정 (필요에 따라 수정)
                  paddingRight: 2, // 우측 패딩 조정 (필요에 따라 수정)
                }}
                >
                  <ListItemText
                    primary={task}
                    primaryTypographyProps={{
                      fontFamily: "Inter-SemiBold, Helvetica",
                      fontWeight: "bold",
                      color: "black",
                    }}
                  />
                    <Chip
                      label={index === 0 ? "완료" : "미완료"}
                      color={index === 0 ? "primary" : "default"}
                      sx={{
                        fontFamily: "Inter-SemiBold, Helvetica",
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: index === 0 ? "black" : "black",
                      }}
                    />
                </ListItem>
              ))}
            </List>
          </Box>
          <Box
            sx={{
              position: "absolute",
              width: 312,
              height: 130,
              top: 249,
              left: 10,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Inter-SemiBold, Helvetica",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Notice
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "Inter-SemiBold, Helvetica",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                "자료 조사" 마감 시한 연장 (11/20 -{'>'} 11/26)
                <br />
                "미팅 잡기" 마감 시한 단축 (11/30 -{'>'} 11/26)
                <br /><br />
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Inter-Bold, Helvetica",
                  fontWeight: "bold",
                  textAlign: "left",
                  color: "black",
                }}
              >
                미팅 예정 11월 27일 수요일
              </Typography>
            </Box>
          </Box>
        </Box>
        <Typography
          variant="h4"
          sx={{
            position: "absolute",
            top: 140,
            left: 40,
            fontFamily: "Inter-SemiBold, Helvetica",
            fontWeight: "bold",
            color: "black",
          }}
        >
          캘린더
        </Typography>
        <Typography
          variant="h6"
          sx={{
            position: "absolute",
            top: 240,
            left: 90,
            fontFamily: "Inter-SemiBold, Helvetica",
            fontWeight: "bold",
            color: "black",
          }}
        >
          TODO : 달력 그림
        </Typography>
        <Box
          component="img"
          src="/image.png"
          alt="Image"
          sx={{
            position: "fixed",
            width: 303,
            height: 139,
            top: 179,
            left: 29,
            objectFit: "cover",
          }}
        />
        <AppBar position="fixed" sx={{ top: 0, left: 0, height: 91 }}>
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar src="/group-2.png" sx={{ width: 34, height: 9 }} alt="Group" />
                  <Avatar src="/vector-2.svg" sx={{ width: 11, height: 11 }} alt="Vector" />
                  <Avatar src="/image-2.svg" sx={{ width: 35, height: 9 }} alt="Image" />
                  <Avatar src="/image-21.png" sx={{ width: 30, height: 30 }} alt="Image" />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar src="/union.svg" sx={{ width: 11, height: 11 }} alt="Union" />
                  <Avatar src="/vector-stroke.svg" sx={{ width: 2, height: 11 }} alt="Vector stroke" />
                  <Avatar src="/vector.svg" sx={{ width: 4, height: 2.5 }} alt="Vector" />
                  <Avatar src="/100.png" sx={{ width: 11, height: 11 }} alt="Element" />
                  <Avatar src="/group-5.png" sx={{ width: 11, height: 11 }} alt="Group" />
                </Box>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            position: "fixed",
            width: 360,
            height: 91,
            top: 0,
            left: 0,
            backgroundColor: "#4d9cff",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: 316,
              height: 39,
              top: 52,
              left: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontFamily: "Inter-SemiBold, Helvetica",
                fontWeight: "bold",
                color: "white",
              }}
            >
              일조매 개발
            </Typography>
            <Avatar src="/image-21.png" sx={{ width: 30, height: 30 }} alt="Image" />
          </Box>
        </Box>
        <Box         //하단 바 
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

export default CalenderLobbyScreen;

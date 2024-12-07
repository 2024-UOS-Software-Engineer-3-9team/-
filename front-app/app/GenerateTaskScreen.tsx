import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GroupIcon from "@mui/icons-material/Group";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ScheduleIcon from "@mui/icons-material/Schedule";
import {
  Avatar,
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";

interface GenerateTaskScreenProps {
  onCalenderPress: () => void;
  onProjectLobbyPress: () => void;
  onSchedulePress: () => void;
}

const GenerateTaskScreen: React.FC<GenerateTaskScreenProps> = ({
  onCalenderPress,
  onProjectLobbyPress,
  onSchedulePress,
}) => {

  const [activeTab, setActiveTab] = useState<"캘린더" | "구성원" | "스케쥴">("캘린더");
  return (
    <Box                        //전체 파란색 배경
      sx={{
        backgroundColor: "#4d9cff",
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Typography       //프로젝트 이름
        variant="h3"
        sx={{
          position: "absolute",
          top: 40,
          left: 250,
          color: "white",
          fontWeight: "bold",
          zIndex: 10,
        }}
      >
        일조매 개발
      </Typography>
      <Container
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
            width: 312,
            height: 621,
            top: 102,
            left: 10,
            backgroundColor: "white",
            padding: 2,
          }}
        >
          <Typography 
          variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
            Task 생성
          </Typography>

          <Box sx={{ mb: 2 }}> 
            <Typography variant="h6" fontWeight="bold">
              마감시한
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              11월 17일 (일) 23시
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              할당 인원
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              구효근, 류수화
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#4d9cff", borderRadius: 1, mr: 1 }}
            >
              등록
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#4d9cff", borderRadius: 1 }}
            >
              선택 해제
            </Button>
          </Box>

          <Box
            sx={{
              height: 325,
              overflowY: "scroll",
              mb: 2,
            }}
          >
            <List>
              {[
                {
                  name: "구효근 (팀장)",
                  role: "UI, React API",
                  tasks: [
                    "과제 제출 준비하기 (~11/18)",
                    "Class Diagrams for static view (~11/17)",
                  ],
                  avatar: "ellipse25",
                  buttonText: "취소",
                },
                {
                  name: "문윤서",
                  role: "UI, React API",
                  tasks: [
                    "UI 종이에 그려서 피드백 받기 (~11/17) (완료)",
                    "UI 피그마로 만들기 (~11/18)",
                  ],
                  avatar: "ellipse24",
                  buttonText: "할당",
                },
                // Add other members here
              ].map((member, index) => (
                <ListItem
                  key={index}
                  sx={{
                    backgroundColor: "#7b7a7a",
                    borderRadius: 1,
                    mb: 2,
                    padding: 2,
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={member.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color="white"
                      >
                        {member.name}
                        <br />
                        {member.role}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        {member.tasks.map((task, idx) => (
                          <Typography
                            key={idx}
                            variant="body2"
                            fontWeight="bold"
                            color="black"
                          >
                            {task}
                          </Typography>
                        ))}
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#4d9cff",
                            borderRadius: 1,
                            mt: 1,
                          }}
                        >
                          {member.buttonText}
                        </Button>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#4d9cff", borderRadius: 1 }}
              onClick={() => {
                setActiveTab('캘린더');
                onCalenderPress();}
              }
            >
              뒤로가기
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#4d9cff", borderRadius: 1 }}
              onClick={() => {
                setActiveTab('캘린더');
                onCalenderPress();}
              }
            >
              확인
            </Button>
          </Box>
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
      </Container>
    </Box>
  );
};

export default GenerateTaskScreen;

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
import React from "react";

interface GenerateTaskScreenProps {
  onBackPress: () => void;
}

const GenerateTaskScreen: React.FC<GenerateTaskScreenProps> = ({ onBackPress }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#4d9cff",
        display: "flex",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
      }}
    >
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
            top: 124,
            left: 24,
            backgroundColor: "white",
            padding: 2,
          }}
        >
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
            Task 생성
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Task 이름
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              sx={{ mt: 1 }}
              placeholder="Task 이름"
            />
          </Box>

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
            >
              뒤로가기
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#4d9cff", borderRadius: 1 }}
            >
              확인
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            position: "fixed",
            width: 360,
            height: 91,
            top: 0,
            left: 0,
            backgroundColor: "#4d9cff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 2,
          }}
        >
          <Typography variant="h4" fontWeight="bold" color="white">
            일조매 개발
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <NotificationsIcon sx={{ color: "white", mr: 2 }} />
            <ArrowBackIcon sx={{ color: "white" }} />
          </Box>
        </Box>
       
        <Box
          sx={{
            position: "absolute",
            width: 360,
            height: 30,
            bottom: 0,
            left: 0,
            display: "flex",
            justifyContent: "space-around",
            backgroundColor: "#4d9cff",
            padding: 1,
          }}
        >
          <Button
            startIcon={<CalendarTodayIcon />}
            sx={{ variant:"h6", color: "white", flex: 1 }}
          >
            캘린더
          </Button>
          <Button 
            startIcon={<GroupIcon />} 
            sx={{ variant:"h6", color: "black", flex: 1, backgroundColor: "#ffffff", }}>
            구성원
          </Button>
          <Button 
            startIcon={<ScheduleIcon />}            
            sx={{ variant:"h6", color: "black", flex: 1, backgroundColor: "#ffffff", }}>
            스케쥴
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default GenerateTaskScreen;

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Avatar,
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
interface ProjectLobbyScreenProps {
  projectId: string;
  onBackPress: () => void;
  onAlarmPress: () => void;
  onAddMemberPress: () => void;
  onCalenderPress: () => void;
  onSchedulePress: () => void;
}

const ProjectLobbyScreen: React.FC<ProjectLobbyScreenProps> = ({
  projectId,
  onBackPress,
  onAlarmPress,
  onAddMemberPress,
  onCalenderPress,
  onSchedulePress,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"캘린더" | "구성원" | "스케쥴">("구성원");
  // AsyncStorage에서 토큰 가져오기
  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("accessToken");
        if (storedToken) {
          setAccessToken(storedToken);
        } else {
          Alert.alert("오류", "로그인이 필요합니다. 다시 로그인 해주세요.");
        }
      } catch (error) {
        console.error("토큰 가져오기 실패:", error);
        Alert.alert("오류", "토큰을 가져오는 중 문제가 발생했습니다.");
      }
    };

    fetchAccessToken();
  }, []);
  

  const participants = [
    { id: "1", name: "구준표" },
    { id: "2", name: "문준혁" },
    { id: "3", name: "유지호" },
  ];

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!accessToken) return;

      try {
        const response = await fetch(
          `http://ec2-43-201-54-81.ap-northeast-2.compute.amazonaws.com:3000/projects/${projectId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          console.log(data);
    
          // 배열을 객체 형태로 변환
          const transformedData = data.map((item: any) => ({
            id: item[0],
            name: item[1],
          }));

          console.log(transformedData);

          setProjectData(transformedData); // 상태에 저장
        } else if (response.status === 400) {
          const errorData = await response.json();
          Alert.alert("실패", errorData.message || "요청이 실패했습니다.");
        } else {
          Alert.alert("실패", "알 수 없는 오류가 발생했습니다.");
        }
      } catch (error) {
        console.error(error);
        Alert.alert("에러", "네트워크 오류가 발생했습니다.");
      }
    };

    fetchProjectData(); // 비동기 함수 호출
  }, [accessToken, projectId]);

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
          position: "absolute",
        }}
      >
          <Typography       //프로젝트 이름
            variant="h3"
            sx={{
              position: "relative",
              top: 30,
              left: 10,
              zIndex: 10,
              color: "white",
              fontWeight: "bold",
            }}
          >
            일조매 개발
          </Typography>
      </Box>
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
            구성원
          </Typography>

          <Box
            sx={{
              height: 500,
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
                  buttonText: "나",
                },
                {
                  name: "문윤서",
                  role: "UI, React API",
                  tasks: [
                    "UI 종이에 그려서 피드백 받기 (~11/17) (완료)",
                    "UI 피그마로 만들기 (~11/18)",
                  ],
                  avatar: "ellipse24",
                  buttonText: "독촉",
                },
                {
                  name: "문윤서",
                  role: "UI, React API",
                  tasks: [
                    "UI 종이에 그려서 피드백 받기 (~11/17) (완료)",
                    "UI 피그마로 만들기 (~11/18)",
                  ],
                  avatar: "ellipse24",
                  buttonText: "독촉",
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
                onAddMemberPress();}
              }
            >
              구성원 추가
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
            onClick={() => {}
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



export default ProjectLobbyScreen;

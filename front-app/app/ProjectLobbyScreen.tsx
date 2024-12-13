import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useProject } from './context/ProjectContext';
import { sendNotification } from './api/notification';

interface ProjectLobbyScreenProps {
  onBackPress: () => void;
  onAlarmPress: () => void;
  onAddMemberPress: () => void;
  onSchedulePress: () => void;
  onCalendarPress: () => void; // 캘린더 화면으로 이동하는 콜백 추가
}

const ProjectLobbyScreen: React.FC<ProjectLobbyScreenProps> = ({
  onBackPress,
  onAlarmPress,
  onAddMemberPress,
  onSchedulePress,
  onCalendarPress, // 캘린더 화면으로 이동하는 콜백 추가
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<any>(null);
  const [activeButton, setActiveButton] = useState<"calendar" | "member" | "schedule">("member");
  const { projectId, userId, leader, setLeader, setCountUser } = useProject();

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
          const transformedData = data.map((item: any) => ({
            id: item[0],
            name: item[1],
          }));

          setCountUser(data.length);
          setProjectData(transformedData);
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

    fetchProjectData();
  }, [accessToken, projectId]);

  const handleButtonPress = (button: "calendar" | "member" | "schedule") => {
    setActiveButton(button);
    if (button === "calendar") {
      onCalendarPress();
    } else if (button === "member") {
      onAddMemberPress();
    } else if (button === "schedule") {
      onSchedulePress();
    }
  };

  const handleReminderPress = async (targetId: string) => {
    if (!accessToken) {
      Alert.alert("오류", "액세스 토큰이 없습니다. 다시 로그인 해주세요.");
      return;
    }

    try {
      sendNotification(
        projectId, 
        `${userId}가 ${targetId}를 독촉했습니다!!!`, 
        [userId, targetId], 
        accessToken
      );
      Alert.alert("성공", "알림이 성공적으로 전송되었습니다.");
    } catch (error) {
      console.error("알림 전송 중 오류 발생:", error);
      Alert.alert("에러", "알림을 전송하는 중 오류가 발생했습니다.");
    }
  };

  const handleDelegatePress = async (targetId: string) => {
    console.log(targetId)
    if (!accessToken) {
      Alert.alert("오류", "액세스 토큰이 없습니다. 다시 로그인 해주세요.");
      return;
    }

    try {
      const response = await fetch(
        `http://ec2-43-201-54-81.ap-northeast-2.compute.amazonaws.com:3000/projects/${projectId}/changeLeader`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            new_leader_id: targetId,
          }),
        }
      );

      if (response.ok) {
        setLeader(targetId);
        Alert.alert("성공", "프로젝트 리더가 성공적으로 변경되었습니다.");
      } else if (response.status === 404) {
        Alert.alert("실패", "프로젝트를 찾을 수 없습니다.");
      } else if (response.status === 400) {
        Alert.alert("실패", "새 리더가 프로젝트 멤버가 아닙니다.");
      } else {
        Alert.alert("실패", "알 수 없는 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("네트워크 오류 발생:", error);
      Alert.alert("에러", "네트워크 오류가 발생했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackPress}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>일조매 개발</Text>
        <TouchableOpacity onPress={onAlarmPress}>
          <Text style={styles.alarmButton}>🔔</Text>
        </TouchableOpacity>
      </View>

      {activeButton === "member" && (
        <FlatList
          data={projectData}
          renderItem={({ item }) => (
            <View style={styles.participantCard}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <TouchableOpacity 
                style={styles.cardButton} 
                onPress={() => handleReminderPress(item.id)} // 🔥 독촉하기 버튼에 추가
              >
                <Text style={styles.cardButtonText}>독촉하기</Text>
              </TouchableOpacity>
              {userId === leader && (
                <TouchableOpacity 
                  style={styles.cardButton} 
                  onPress={() => handleDelegatePress(item.id)} 
                >
                  <Text style={styles.cardButtonText}>팀장위임</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      {/* 하단 네비게이션 버튼 (고정) */}
      <View style={styles.fixedFooter}>
        <TouchableOpacity
          style={[styles.footerButton, activeButton === "calendar" ? styles.activeButton : styles.inactiveButton]}
          onPress={() => handleButtonPress("calendar")}
        >
          <Text style={styles.footerButtonText}>캘린더</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.footerButton, activeButton === "member" ? styles.activeButton : styles.inactiveButton]}
          onPress={() => handleButtonPress("member")}
        >
          <Text style={styles.footerButtonText}>구성원</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.footerButton, activeButton === "schedule" ? styles.activeButton : styles.inactiveButton]}
          onPress={() => handleButtonPress("schedule")}
        >
          <Text style={styles.footerButtonText}>스케줄</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={onAddMemberPress}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#4A90E2" },
  header: { flexDirection: "row", justifyContent: "space-between", padding: 16 },
  backButton: { color: "#FFFFFF", fontSize: 20 },
  headerTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
  alarmButton: { color: "#FFFFFF", fontSize: 20 },
  list: { paddingBottom: 80 },
  participantCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold" },
  cardButton: {
    marginTop: 8,
    backgroundColor: "#0066FF",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  cardButtonText: { color: "#FFFFFF", fontSize: 12 },
  fixedFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    zIndex: 10,
  },
  footerButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  activeButton: {
    backgroundColor: "#003C8F",
  },
  inactiveButton: {
    backgroundColor: "#E0E0E0",
  },
  footerButtonText: {
    color: "#000000",
    fontSize: 14,
  },
  addButton: {
    position: "absolute",
    bottom: 80,
    right: 16,
    backgroundColor: "#FFFFFF",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: { fontSize: 24, color: "#4A90E2" },
});

export default ProjectLobbyScreen;
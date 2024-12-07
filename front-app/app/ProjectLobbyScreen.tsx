import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useProject } from './context/ProjectContext';

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
  const { projectId, leader, setProjectId, setLeader } = useProject();

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
              <TouchableOpacity style={styles.cardButton}>
                <Text style={styles.cardButtonText}>독촉하기</Text>
              </TouchableOpacity>
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

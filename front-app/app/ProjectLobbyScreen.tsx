import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ProjectLobbyScreenProps {
  projectId: string;
  onBackPress: () => void;
  onAlarmPress: () => void;
  onAddMemberPress: () => void;
  onSchedulePress: () => void;
}

const ProjectLobbyScreen: React.FC<ProjectLobbyScreenProps> = ({
  projectId,
  onBackPress,
  onAlarmPress,
  onAddMemberPress,
  onSchedulePress,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<any>(null);
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
  
  const [activeTab, setActiveTab] = useState<"구성원" | "스케줄">("구성원");

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
      {activeTab === "구성원" && (
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
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerButton, activeTab === "구성원" && styles.activeButton]}
          onPress={() => setActiveTab("구성원")}
        >
          <Text style={styles.footerButtonText}>구성원</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, activeTab === "스케줄" && styles.activeButton]}
          onPress={() => {
            setActiveTab("스케줄");
            onSchedulePress();
          }}
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
  cardRole: { fontSize: 12, color: "#555" },
  cardTask: { fontSize: 12, marginTop: 4 },
  cardButton: {
    marginTop: 8,
    backgroundColor: "#0066FF",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  cardButtonText: { color: "#FFFFFF", fontSize: 12 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
  },
  footerButton: { flex: 1, alignItems: "center", paddingVertical: 8 },
  activeButton: { backgroundColor: "#003C8F" },
  footerButtonText: { color: "#FFFFFF", fontSize: 14 },
  addButton: {
    position: "absolute",
    bottom: 16,
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

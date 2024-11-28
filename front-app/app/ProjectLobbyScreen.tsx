import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";

interface ProjectLobbyScreenProps {
  onBackPress: () => void;
  onAlarmPress: () => void;
  onAddMemberPress: () => void;
  onSchedulePress: () => void;
}

const participants = [
  { id: "1", name: "구준표", role: "UI, React API", tasks: ["과제 제출 준비 (~11/18)", "클래스 다이어그램 (~11/17)"] },
  { id: "2", name: "문준혁", role: "UI, React API", tasks: ["UI 요소 작업 (~11/18)", "레이아웃 만들기 (~11/17)"] },
  { id: "3", name: "유지호", role: "UI, 기획", tasks: ["UI creative 작업 (~11/18)"] },
];

const ProjectLobbyScreen: React.FC<ProjectLobbyScreenProps> = ({
  onBackPress,
  onAlarmPress,
  onAddMemberPress,
  onSchedulePress,
}) => {
  const [activeTab, setActiveTab] = useState<"구성원" | "스케줄">("구성원");

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
          data={participants}
          renderItem={({ item }) => (
            <View style={styles.participantCard}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardRole}>({item.role})</Text>
              {item.tasks.map((task, index) => (
                <Text key={index} style={styles.cardTask}>
                  {index + 1}. {task}
                </Text>
              ))}
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

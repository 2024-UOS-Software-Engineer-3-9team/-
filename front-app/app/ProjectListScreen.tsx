import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";

interface ProjectListScreenProps {
  onSettingsPress: () => void;
  onAlarmPress: () => void;
  onAddProjectPress: () => void;
  onProjectPress: (projectId: string) => void; // 프로젝트로 이동하는 콜백 추가
}

const projects = [
  {
    id: "1",
    title: "일조매 개발",
    progress: 37,
    tasks: ["고양이 밥주기 (11/17)", "즐거운 개발 (11/30)"],
    nextMeeting: "11/20 오후 7시",
  },
  {
    id: "2",
    title: "일조매 개발",
    progress: 37,
    tasks: ["고양이 밥주기 (11/17)", "즐거운 개발 (11/30)"],
    nextMeeting: "11/20 오후 7시",
  },
  {
    id: "3",
    title: "일조매 개발",
    progress: 37,
    tasks: ["고양이 밥주기 (11/17)", "즐거운 개발 (11/30)"],
    nextMeeting: "11/20 오후 7시",
  },
];

const ProjectListScreen: React.FC<ProjectListScreenProps> = ({
  onSettingsPress,
  onAlarmPress,
  onAddProjectPress,
  onProjectPress, // 프로젝트 이동 콜백
}) => {
  const renderItem = ({ item }: { item: typeof projects[0] }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardProgress}>{item.progress}%</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTaskHeader}>진행 중 TASK</Text>
        {item.tasks.map((task, index) => (
          <Text key={index} style={styles.cardTask}>
            {index + 1}. {task}
          </Text>
        ))}
        <Text style={styles.cardMeeting}>다음 미팅 시간: {item.nextMeeting}</Text>
      </View>
      <TouchableOpacity style={styles.cardButton} onPress={() => onProjectPress(item.id)}>
        <Text style={styles.cardButtonText}>바로가기</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>11/16 (토)</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={onAlarmPress} style={styles.iconButton}>
            <Text style={styles.icon}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSettingsPress} style={styles.iconButton}>
            <Text style={styles.icon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 프로젝트 목록 */}
      <FlatList
        data={projects}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      {/* 추가 버튼 */}
      <TouchableOpacity style={styles.floatingButton} onPress={onAddProjectPress}>
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4A90E2",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  headerIcons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 10,
  },
  icon: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  list: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  cardProgress: {
    fontSize: 18,
    color: "#000000",
  },
  cardBody: {
    marginTop: 8,
  },
  cardTaskHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
  },
  cardTask: {
    fontSize: 14,
    color: "#000000",
  },
  cardMeeting: {
    fontSize: 12,
    color: "#555555",
    marginTop: 8,
  },
  cardButton: {
    backgroundColor: "#0066FF",
    borderRadius: 8,
    marginTop: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  cardButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  floatingButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  floatingButtonText: {
    fontSize: 24,
    color: "#4A90E2",
  },
});

export default ProjectListScreen;

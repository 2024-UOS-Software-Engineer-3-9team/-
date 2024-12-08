import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Modal } from "react-native";
import { format } from "date-fns";
import { useNavigation } from '@react-navigation/native'; // 네비게이션 훅 사용
import GenerateTaskScreen from "./GenerateTaskScreen"; // GenerateTaskScreen 가져오기

interface Task {
  id: string;
  title: string;
  assignees: string[];
  status: "ongoing" | "completed";
}

const DaysDetailScreen: React.FC<{ onBackPress: () => void }> = ({ onBackPress }) => {
  const [isTaskModalVisible, setTaskModalVisible] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "진행 중 작업 1", assignees: ["홍길동"], status: "ongoing" },
    { id: "2", title: "진행 중 작업 2", assignees: ["김철수"], status: "ongoing" },
    { id: "3", title: "진행 중 작업 3", assignees: ["이영희"], status: "ongoing" },
    { id: "4", title: "완료된 작업 1", assignees: ["박지민"], status: "completed" },
    { id: "5", title: "완료된 작업 2", assignees: ["최민수"], status: "completed" },
    { id: "6", title: "진행 중 작업 4", assignees: ["홍길동"], status: "ongoing" },
    { id: "7", title: "완료된 작업 3", assignees: ["김철수"], status: "completed" },
    { id: "8", title: "진행 중 작업 5", assignees: ["이영희"], status: "ongoing" },
    { id: "9", title: "완료된 작업 4", assignees: ["박지민"], status: "completed" },
    { id: "10", title: "진행 중 작업 6", assignees: ["최민수"], status: "ongoing" },
  ]);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const navigation = useNavigation(); // 네비게이션 훅 사용

  const handleMeetingSchedule = () => {
    Alert.alert("미팅 일정", "미팅 일정이 표시됩니다.");
  };

  const handleManageButton = () => {
    Alert.alert("관리 버튼", "관리 옵션이 표시됩니다.");
  };

  const handleAddTask = (task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  const handleRemindButton = (taskId: string) => {
    Alert.alert("독촉하기", `작업 ${taskId}에 대해 독촉 메시지가 전송됩니다.`);
  };

  const handleOpenGenerateTask = () => {
    setTaskModalVisible(true);
  };

  const handleCloseGenerateTask = () => {
    setTaskModalVisible(false);
  };

  const handleSaveTask = (task: { deadline: string; assignees: string[] }) => {
    const newTask: Task = {
      id: new Date().toISOString(),
      title: "새 작업",
      assignees: task.assignees,
      status: "ongoing",
    };
    handleAddTask(newTask);
    setTaskModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={onBackPress}>
        <Text style={styles.buttonText}>뒤로가기</Text>
      </TouchableOpacity>

      <Text style={styles.dateText}>{date}</Text>

      <View style={styles.buttonsRow}>
        <Text style={styles.meetingText} onPress={handleMeetingSchedule}>
          미팅 일정
        </Text>
        <Text style={styles.manageText} onPress={handleManageButton}>
          관리
        </Text>
      </View>

      <Text style={styles.sectionTitle}>진행 중인 작업</Text>
      <ScrollView style={styles.taskContainer}>
        {tasks
          .filter((task) => task.status === "ongoing")
          .slice(0, 3)
          .map((task) => (
            <View key={task.id} style={styles.taskItem}>
              <View style={styles.taskRow}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <TouchableOpacity
                  style={styles.remindButton}
                  onPress={() => handleRemindButton(task.id)}
                >
                  <Text style={styles.buttonText}>독촉하기</Text>
                </TouchableOpacity>
              </View>
              <Text>할당인원: {task.assignees.join(", ")}</Text>
            </View>
          ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>완료된 작업</Text>
      <ScrollView style={styles.taskContainer}>
        {tasks
          .filter((task) => task.status === "completed")
          .slice(0, 3)
          .map((task) => (
            <View key={task.id} style={styles.taskItem}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text>할당인원: {task.assignees.join(", ")}</Text>
            </View>
          ))}
      </ScrollView>

      <TouchableOpacity style={styles.createButton} onPress={handleOpenGenerateTask}>
        <Text style={styles.buttonText}>작업 만들기</Text>
      </TouchableOpacity>

      <GenerateTaskScreen
        visible={isTaskModalVisible}
        onClose={handleCloseGenerateTask}
        onSave={handleSaveTask}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#4A90E2",
    padding: 20,
  },
  goBackButton: {
    backgroundColor: "#5C99B2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#ffffff",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  meetingText: {
    fontSize: 18,
    color: "#E3F2FD",
    textDecorationLine: "underline",
  },
  manageText: {
    fontSize: 18,
    color: "#E3F2FD",
    textDecorationLine: "underline",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#ffffff",
  },
  taskContainer: {
    width: "100%",
    maxHeight: 300,
    marginBottom: 20,
  },
  taskItem: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
  },
  taskRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    flex: 1,
  },
  remindButton: {
    backgroundColor: "#E94E77",
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  createButton: {
    backgroundColor: "#81D4FA", // 파스텔 톤의 파란색
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#ffffff", // 흰색 텍스트
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 반투명 배경
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
});

export default DaysDetailScreen;

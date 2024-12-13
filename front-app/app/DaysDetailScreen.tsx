import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Modal, TextInput } from "react-native";
import { format } from "date-fns";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useProject } from './context/ProjectContext';
import { sendNotification } from './api/notification';
import GenerateTaskScreen from "./GenerateTaskScreen";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  assignees: string[];
  status: "ongoing" | "completed";
}

const DaysDetailScreen: React.FC<{ onBackPress: () => void }> = ({ onBackPress }) => {
  const [isTaskModalVisible, setTaskModalVisible] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState<Task>();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { projectId, date } = useProject();

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("accessToken");
        if (storedToken) {
          setAccessToken(storedToken);
          fetchTasksFromServer(storedToken);
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

  const fetchTasksFromServer = async (accessToken: string) => {
    try {
      const response = await fetch(
        `http://ec2-43-201-54-81.ap-northeast-2.compute.amazonaws.com:3000/projects/${projectId}/tasks`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error('서버 오류 메시지:', errorMessage);
        Alert.alert('오류', `서버 오류: ${errorMessage}`);
        return;
      }

      const data = await response.json();
      const formattedTasks = data.map((task: any) => ({
        id: task.taskId.toString(),
        title: task.taskName,
        dueDate: task.dueDate,
        assignees: task.userIds,
        status: task.isDone === 1 ? "completed" : "ongoing",
      }));
      setTasks(formattedTasks);
    } catch (error) {
      console.error('작업 가져오기 중 오류 발생:', error);
      Alert.alert('오류', '작업을 불러오는 중 문제가 발생했습니다.');
    }
  };

  const handleOpenEditModal = (task: Task) => {
    setTask(task);
    setTaskModalVisible(true);
  };

  const handleAddTask = (task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  const handleRemindButton = async (taskName: string, targetId: string[]) => {
    Alert.alert("독촉하기", `작업 ${taskName}에 대해 독촉 메시지가 전송됩니다.`);

    try {
      sendNotification(
        projectId, 
        `${targetId}님 ${taskName} 서둘러주세요!!`, 
        targetId,
        accessToken
      );
      Alert.alert("성공", "알림이 성공적으로 전송되었습니다.");
    } catch (error) {
      console.error("알림 전송 중 오류 발생:", error);
      Alert.alert("에러", "알림을 전송하는 중 오류가 발생했습니다.");
    }
  };

  const handleOpenGenerateTask = () => {
    setTaskModalVisible(true);
  };

  const handleCloseGenerateTask = () => {
    setTaskModalVisible(false);
  };

  const handleSaveTask = (task: { task_id: string|undefined; deadline: string; assignees: string[] }) => {
    const newTask: Task = {
      id: new Date().toISOString(),
      title: "새 작업",
      assignees: task.assignees,
      status: "ongoing",
    };
    console.log(newTask);
    handleAddTask(newTask);
    setTaskModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackPress}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>일조매 개발</Text>
      </View>

      <Text style={styles.dateText}>{date}</Text>

      <Text style={styles.sectionTitle}>진행 중인 작업</Text>
      <ScrollView style={styles.taskContainer}>
        {tasks
          .filter((task) => task.status === "ongoing" && task.dueDate > date)
          .sort((a, b) => new Date((a.dueDate as string).slice(0, 10)).getTime() - new Date((b.dueDate as string).slice(0, 10)).getTime())
          .map((task) => (
            <View key={task.id} style={styles.taskItem}>
              <View style={styles.taskRow}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <TouchableOpacity
                  style={styles.remindButton}
                  onPress={() => handleRemindButton(task.title, task.assignees.map(assignee => assignee.nickname))}
                >
                  <Text style={styles.buttonText}>독촉하기</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.remindButton}
                  onPress={() => handleOpenEditModal(task)}
                >
                  <Text style={styles.buttonText}>수정</Text>
                </TouchableOpacity>
              </View>
              <Text>할당인원: {task.assignees.map(assignee => assignee.nickname).join(", ")}</Text>
              <Text>마감기한: {task.dueDate.slice(0, 10)}</Text>
            </View>
          ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>완료된 작업</Text>
      <ScrollView style={styles.taskContainer}>
        {tasks
          .filter((task) => task.status === "completed" && task.dueDate > date)
          .map((task) => (
            <View key={task.id} style={styles.taskItem}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text>할당인원: {task.assignees.map(assignee => assignee.nickname).join(", ")}</Text>
            </View>
          ))}
      </ScrollView>

      <TouchableOpacity style={styles.createButton} onPress={handleOpenGenerateTask}>
        <Text style={styles.buttonText}>작업 만들기</Text>
      </TouchableOpacity>

      <GenerateTaskScreen
        edit = {true}
        task_id= {task?.id}
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
    backgroundColor: "#4A90E2",
    padding: 16,
    position: "relative",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    color: "#FFFFFF",
    fontSize: 20,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
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
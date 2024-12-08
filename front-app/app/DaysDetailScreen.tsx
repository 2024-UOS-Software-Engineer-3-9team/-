import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { format } from "date-fns";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useProject } from './context/ProjectContext';
import GenerateTaskScreen from "./GenerateTaskScreen"; 

interface Task {
  id: string;
  title: string;
  assignees: string[];
  status: "ongoing" | "completed";
}

const DaysDetailScreen: React.FC<{ onBackPress: () => void }> = ({ onBackPress }) => {
  const [isTaskModalVisible, setTaskModalVisible] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { projectId } = useProject();
  const navigation = useNavigation(); 

  // 📢 서버에서 작업 목록 가져오기
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
        assignees: task.userIds,
        status: task.isDone === 1 ? "completed" : "ongoing",
      }));
      setTasks(formattedTasks);
    } catch (error) {
      console.error('작업 가져오기 중 오류 발생:', error);
      Alert.alert('오류', '작업을 불러오는 중 문제가 발생했습니다.');
    }
  };

  const updateTaskStatus = async (taskId: string) => {
    try {
      const response = await fetch(
        `http://ec2-43-201-54-81.ap-northeast-2.compute.amazonaws.com:3000/projects/${projectId}/tasks/isdone`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ task_id: taskId }) // 요청 Body에 task_id 추가
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error('서버 오류 메시지:', errorMessage);
        
        if (response.status === 404) {
          Alert.alert('오류', '해당 TASK를 찾을 수 없습니다.');
        } else if (response.status === 500) {
          Alert.alert('오류', 'Task 완료 처리 중 오류가 발생했습니다.');
        } else {
          Alert.alert('오류', '서버 오류가 발생했습니다.');
        }

        return;
      }

      Alert.alert('성공', '작업이 완료되었습니다.');
      
      // 서버 업데이트 후 클라이언트의 상태도 업데이트
      setTasks((prevTasks) => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('작업 상태 업데이트 중 오류 발생:', error);
      Alert.alert('오류', '작업 상태를 업데이트하는 중 문제가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={onBackPress}>
        <Text style={styles.buttonText}>뒤로가기</Text>
      </TouchableOpacity>

      <Text style={styles.dateText}>{date}</Text>

      <Text style={styles.sectionTitle}>진행 중인 작업</Text>
      <ScrollView style={styles.taskContainer}>
        {tasks
          .filter((task) => task.status === "ongoing")
          .map((task) => (
            <View key={task.id} style={styles.taskItem}>
              <View style={styles.taskRow}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <TouchableOpacity
                  style={styles.remindButton}
                  onPress={() => updateTaskStatus(task.id)} 
                >
                  <Text style={styles.buttonText}>완료</Text>
                </TouchableOpacity>
              </View>
              <Text>할당인원: {task.assignees.join(", ")}</Text>
            </View>
          ))}
      </ScrollView>
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

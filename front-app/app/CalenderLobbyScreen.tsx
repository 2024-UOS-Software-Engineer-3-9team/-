import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ScrollView } from "react-native";
import { format, addDays } from "date-fns"; 
import GenerateTaskScreen from "./GenerateTaskScreen";
import { useProject } from './context/ProjectContext';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Int32 } from "react-native/Libraries/Types/CodegenTypes";

interface ProjectLobbyScreenProps {
  onCalenderPress: () => void;
  onProjectLobbyPress: () => void;
  onSchedulePress: () => void;
  onBackPress: () => void;
  setCurrentScreen: (screen: string) => void; 
  setChosenDate: (date: string) => void; 
}

interface task{
  id: string,
  date: string,
  task: string,
  isDone: Int32,
  users: string[],
}

const CalendarLobbyScreen: React.FC<ProjectLobbyScreenProps> = ({
  onCalenderPress,
  onProjectLobbyPress,
  onSchedulePress,
  onBackPress,
  setCurrentScreen,
  setChosenDate,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeButton, setActiveButton] = useState<"calendar" | "member" | "schedule">("calendar");
  const [showNotices, setShowNotices] = useState(false);
  const [isTaskModalVisible, setTaskModalVisible] = useState(false); 
  const [tasks, setTasks] = useState([]); 
  const { projectId, leader, setProjectId, setLeader } = useProject();
  const [accessToken, setAccessToken] = useState<string | null>(null);

useEffect(() => {
  const initializeData = async () => {
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

  initializeData();
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
      id: task.taskId,
      date: task.dueDate.slice(0, 10),
      task: task.taskName,
      isDone: task.isDone,
      users: task.userIds,
    }));
    setTasks(formattedTasks);
  } catch (error) {
    console.error('작업 가져오기 중 오류 발생:', error);
    Alert.alert('오류', '작업을 불러오는 중 문제가 발생했습니다.');
  }
};

const markTaskAsComplete = async (taskId: string) => {
  try {
    const response = await fetch(
      `http://ec2-43-201-54-81.ap-northeast-2.compute.amazonaws.com:3000/projects/${projectId}/tasks/isdone`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ task_id: taskId })
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error('서버 오류 메시지:', errorMessage);
      Alert.alert('오류', `서버 오류: ${errorMessage}`);
      return;
    }

    const updatedTasks = tasks.map((task: task) => 
      task.id === taskId ? { ...task, isDone: 1 } : task
    );
    setTasks(updatedTasks);
    Alert.alert("성공", "작업이 완료되었습니다.");
  } catch (error) {
    console.error('작업 완료 중 오류 발생:', error);
    Alert.alert('오류', '작업 완료 중 오류가 발생했습니다.');
  }
};



  const getTasksForDate = (date: string) => {
    return tasks.filter((task: task) => task.date === date);
  };

  // 현재 주의 월요일부터 일요일까지의 날짜를 가져옴
  const getDateRange = () => {
    const startOfWeek = addDays(selectedDate, -((selectedDate.getDay() + 6) % 7)); // 이번 주 월요일로 보정
    let dateRange = [];
    for (let i = 0; i < 7; i++) {
      dateRange.push(format(addDays(startOfWeek, i), "yyyy-MM-dd"));
    }
    return dateRange;
  };

  const changeDate = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    if (direction === "next") {
      newDate.setDate(selectedDate.getDate() + 7);
    } else if (direction === "prev") {
      newDate.setDate(selectedDate.getDate() - 7);
    }
    setSelectedDate(newDate);
  };

  const handleButtonPress = (button: "calendar" | "member" | "schedule") => {
    setActiveButton(button);
    if (button === "calendar") {
      onCalenderPress();
    } else if (button === "member") {
      onProjectLobbyPress();
    } else if (button === "schedule") {
      onSchedulePress();
    }
  };

  const handleOpenGenerateTask = () => {
    setTaskModalVisible(true); 
  };

  const handleCloseGenerateTask = () => {
    setTaskModalVisible(false); 
  };

  const handleSaveTask = (task: { deadline: string; assignees: string[] }) => {
    console.log("작업 저장:", task);
    setTaskModalVisible(false); 
  };

  const handleDatePress = (date: string) => {
    setChosenDate(date); 
    setCurrentScreen("DaysDetail"); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackPress}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>일조매 개발</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.taskTableContainer}>
          <Text style={styles.sectionTitle}>날짜별 작업 표</Text>
          <View style={styles.dateNav}>
            <TouchableOpacity style={styles.navButton} onPress={() => changeDate("prev")}>
              <Text style={styles.navButtonText}>이전</Text>
            </TouchableOpacity>
            <Text style={styles.selectedDate}>{format(selectedDate, "yyyy-MM-dd")}</Text>
            <TouchableOpacity style={styles.navButton} onPress={() => changeDate("next")}>
              <Text style={styles.navButtonText}>다음</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              {getDateRange().map((date, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.tableCell}
                  onPress={() => handleDatePress(date)} 
                >
                  <Text style={styles.tableHeaderCell}>{format(new Date(date), "MM/dd")}</Text>
                  {getTasksForDate(date).map((task: task) => (
                    <Text key={task.id} style={styles.taskText}>
                      {task.task}
                    </Text>
                  ))}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.notice}>
          <Text style={styles.noticeText}>중요 공지: 내일까지 제출해야 하는 보고서가 있습니다!</Text>
          {showNotices && (
            <View style={styles.noticeDetails}>
              <Text style={styles.noticeDetailText}>공지 1: 제출 기한이 다가옵니다.</Text>
              <Text style={styles.noticeDetailText}>공지 2: 회의가 예정되어 있습니다.</Text>
              <Text style={styles.noticeDetailText}>공지 3: 새로운 과제가 추가되었습니다.</Text>
            </View>
          )}
          <TouchableOpacity onPress={() => setShowNotices(!showNotices)} style={styles.toggleButton}>
            <Text style={styles.toggleButtonText}>{showNotices ? "접기" : "펼치기"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.taskListContainer}>
          <Text style={styles.title}>작업 목록</Text>
          <FlatList
            data={tasks}
            renderItem={({ item }: { item: task }) => (
              <View style={styles.taskItem}>
                <Text style={styles.taskText}>작업명: {item.task}</Text>
                <Text style={styles.taskText}>마감일: {item.date}</Text>
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={() => markTaskAsComplete(item.id)} 
                  disabled={item.isDone === 1} // 🔥 완료된 경우 비활성화
                >
                  <Text style={styles.completeButtonText}>
                  {item.isDone === 1 ? "완료됨" : "완료"} </Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()} // 🔥 고유 키 보장

          />
        </View>

        <TouchableOpacity style={styles.createTaskButton} onPress={handleOpenGenerateTask}>
          <Text style={styles.createTaskButtonText}>작업 만들기</Text>
        </TouchableOpacity>

        <GenerateTaskScreen
          visible={isTaskModalVisible}
          onClose={handleCloseGenerateTask}
          onSave={handleSaveTask}
        />
      </ScrollView>

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
  scrollContainer: {
    paddingBottom: 60, // 여유 공간을 추가하여 버튼이 겹치지 않도록 함
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  taskTableContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 20,
    padding: 15,
  },
  dateNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  navButton: {
    backgroundColor: "#000000",
    padding: 10,
    borderRadius: 5,
  },
  navButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  selectedDate: {
    fontSize: 16,
    color: "#333333",
  },
  table: {
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#E0E0E0",
    padding: 10,
    justifyContent: "space-around",
  },
  tableHeaderCell: {
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
    color: "#333333",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    color: "#333333",
  },
  taskText: {
    fontSize: 14,
    color: "#000000",
  },
  notice: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  noticeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF0000",
  },
  noticeDetails: {
    marginTop: 10,
  },
  noticeDetailText: {
    fontSize: 14,
    color: "#333333",
  },
  toggleButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#4A90E2",
    borderRadius: 5,
    alignItems: "center",
  },
  toggleButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  taskListContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
    paddingVertical: 10,
  },
  completeButton: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  createTaskButton: {
    backgroundColor: "#000000",
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: "center",
  },
  createTaskButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
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

export default CalendarLobbyScreen;

import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ScrollView } from "react-native";
import { format, addDays, subDays } from "date-fns"; // 날짜 포맷을 위한 라이브러리
import GenerateTaskScreen from "./GenerateTaskScreen"; // GenerateTaskScreen 가져오기

// 더미 데이터
const tasks = [
  { id: "1", date: "2024-12-08", task: "프로젝트 회의 준비" },
  { id: "2", date: "2024-12-08", task: "코드 리뷰" },
  { id: "3", date: "2024-12-09", task: "문서 작성" },
  { id: "4", date: "2024-12-09", task: "디자인 피드백" },
  { id: "5", date: "2024-12-10", task: "제품 발표 준비" },
  { id: "6", date: "2024-12-11", task: "팀 회의" },
  { id: "7", date: "2024-12-12", task: "마케팅 전략 논의" },
  { id: "8", date: "2024-12-13", task: "디버깅" },
  { id: "9", date: "2024-12-14", task: "테스트 계획 작성" },
  { id: "10", date: "2024-12-15", task: "배포 준비" },
];

interface ProjectLobbyScreenProps {
  onCalenderPress: () => void;
  onProjectLobbyPress: () => void;
  onSchedulePress: () => void;
  onBackPress: () => void;
  setCurrentScreen: (screen: string) => void; // 추가
  setChosenDate: (date: string) => void; // 변수 이름 변경
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
  const [isTaskModalVisible, setTaskModalVisible] = useState(false); // 팝업 상태 관리

  // 날짜별로 작업 필터링
  const getTasksForDate = (date: string) => {
    return tasks.filter((task) => task.date === date);
  };

  // 7일의 날짜 범위 설정 (오늘부터 7일)
  const getDateRange = () => {
    let dateRange = [];
    for (let i = 0; i < 7; i++) {
      dateRange.push(format(addDays(selectedDate, i), "yyyy-MM-dd"));
    }
    return dateRange;
  };

  // 날짜 변경 (이전, 다음)
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
    setTaskModalVisible(true); // "작업 만들기" 버튼 클릭 시 팝업 띄우기
  };

  const handleCloseGenerateTask = () => {
    setTaskModalVisible(false); // 팝업 닫기
  };

  const handleSaveTask = (task: { deadline: string; assignees: string[] }) => {
    // 작업 저장 로직
    console.log("작업 저장:", task);
    setTaskModalVisible(false); // 작업 저장 후 팝업 닫기
  };  
  
  const handleDatePress = (date: string) => {
    setChosenDate(date); // 외부 상태 업데이트
    setCurrentScreen("DaysDetail"); // DaysDetail 화면으로 전환
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackPress}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>일조매 개발</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 날짜별 작업 표 (맨 위 부분) */}
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
                  onPress={() => handleDatePress(date)} // 날짜 클릭 시 동작
                >
                  <Text style={styles.tableHeaderCell}>{format(new Date(date), "MM/dd")}</Text>
                  {getTasksForDate(date).map((task) => (
                    <Text key={task.id} style={styles.taskText}>
                      {task.task}
                    </Text>
                  ))}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* 중요 공지사항 (중간 부분) */}
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

        {/* 작업 목록과 완료 버튼, 작업 만들기 버튼 (맨 아래 부분) */}
        <View style={styles.taskListContainer}>
          <Text style={styles.title}>작업 목록</Text>
          <FlatList
            data={tasks}
            renderItem={({ item }) => (
              <View style={styles.taskItem}>
                <Text style={styles.taskText}>{item.task}</Text>
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={() => Alert.alert("완료", `${item.task}가 완료되었습니다.`)}
                >
                  <Text style={styles.completeButtonText}>완료</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>

        {/* 작업 만들기 버튼 */}
        <TouchableOpacity style={styles.createTaskButton} onPress={() => {
            Alert.alert("작업 만들기", "새로운 작업을 추가해주세요.");
            handleOpenGenerateTask();
          }}>
          <Text style={styles.createTaskButtonText}>작업 만들기</Text>
        </TouchableOpacity>

        {/* GenerateTaskScreen 팝업 */}
        <GenerateTaskScreen
          visible={isTaskModalVisible}
          onClose={handleCloseGenerateTask}
          onSave={handleSaveTask}
        />
      </ScrollView>

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

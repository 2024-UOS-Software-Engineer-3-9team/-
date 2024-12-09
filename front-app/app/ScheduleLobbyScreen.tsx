import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, ScrollView } from "react-native";
import InsertSchedulePopup from "./InsertSchedulePopup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useProject } from './context/ProjectContext';
import { sendNotification } from './api/notification';
import { format, addDays } from "date-fns";

interface ScheduleLobbyScreenProps {
  onBackPress: () => void;
  onCalendarPress: () => void;
  onMemberPress: () => void; // 구성원 화면으로 이동하는 콜백
  onSchedulePress: () => void;
}

interface Schedule {
  SCHEDULE_ID: string;
  USER_ID: string;
  TIME: string;
  DATE_MEET: string;
}

const days = ["월", "화", "수", "목", "금", "토", "일"];
const times = [...Array(24)].map((_, i) => `${i}:00`);

const ScheduleLobbyScreen: React.FC<ScheduleLobbyScreenProps> = ({
  onBackPress,
  onCalendarPress,
  onMemberPress,
  onSchedulePress,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isSelectTimePopupVisible, setSelectTimePopupVisible] = useState(false); // 회의 시간 선택 팝업
  const [isInsertSchedulePopupVisible, setInsertSchedulePopupVisible] = useState(false); // InsertSchedulePopup
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedCells, setSelectedCells] = useState<Map<string, number>>(new Map());
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [activeButton, setActiveButton] = useState<"calendar" | "member" | "schedule">("schedule");
  const { countUser, userId, projectId, leader } = useProject();

  let realCountUser = (userId == leader) ? countUser : 1;

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

  // 현재 주의 월요일부터 일요일까지의 날짜를 가져옴
  const getDateRange = () => {
    const startOfWeek = addDays(selectedDate, -((selectedDate.getDay() + 6) % 7)); // 이번 주 월요일로 보정
    let dateRange = [];
    for (let i = 0; i < 7; i++) {
      dateRange.push(format(addDays(startOfWeek, i), "yyyy-MM-dd"));
    }
    return dateRange;
  };

  // 이전주, 다음주로 이동
  const changeDate = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    if (direction === "next") {
      newDate.setDate(selectedDate.getDate() + 7);
    } else if (direction === "prev") {
      newDate.setDate(selectedDate.getDate() - 7);
    }
    setSelectedDate(newDate);
  };

  const getCellsFromSchedule = (schedules: Schedule[]): Map<string, number> => {
    const selectedCells = new Map<string, number>();
  
    for(let i = 0; i < schedules.length; i++) 
    {
      for (let j = 0; j < 24; j++) 
      {
        if (schedules[i].TIME[j] === '1') 
        {
          const cellKey = `${j}-${i % 7}`; // 1이 있는 인덱스를 'j-i' 형태로 저장
          const currentCount = selectedCells.get(cellKey) || 0;
          selectedCells.set(cellKey, currentCount + 1); // 중복 카운트 증가
        }
      }
    }
  
    return selectedCells;
  };

  useEffect(() => {
    // if (schedules.length > 0)
    // {
      setSelectedCells(getCellsFromSchedule(schedules));
    // }
  }, [schedules])

  useEffect(() => {
    fetchSchedules();
  }, [selectedDate])

  const fetchSchedules = async() => {
    let isLeader = "myschedules";
    if(userId == leader)
    {
      isLeader = "schedules"
    }
    const dateRange = getDateRange();
    const start_day = dateRange[0]; // 이번 주 월요일
    const end_day = dateRange[6];   // 이번 주 일요일
    try {
      const response = await fetch(`http://ec2-43-201-54-81.ap-northeast-2.compute.amazonaws.com:3000/projects/${projectId}/${isLeader}?start_day=${start_day}&end_day=${end_day}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        Alert.alert("성공", "스케줄이 조회되었습니다.");
        const data = await response.json();
      
        // 배열을 객체 형태로 변환
        const transformedData = data.map((item: any) => ({
          SCHEDULE_ID: item[0],
          USER_ID: item[1],
          TIME: item[2],
          DATE_MEET: item[3],
        }));

        setSchedules(transformedData); // 데이터를 상태에 저장
      } else {
        const errorData = await response.json();
        Alert.alert("오류", errorData.message || "스케줄 조회에 실패했습니다.");
      }
    } catch (error) {
      console.error("API 요청 오류:", error);
      Alert.alert("에러", "스케줄 조회 중 네트워크 오류가 발생했습니다.");
    }
  }

  const calculateCellColor = (count: number) => {
    const startColor = { r: 255, g: 255, b: 255 }; // #FFFFFF
    const endColor = { r: 0, g: 204, b: 0 }; // #00CC00
    const ratio = Math.min(count / realCountUser, 1); // 비율 (0 ~ 1)
    
    const r = Math.round(startColor.r + (endColor.r - startColor.r) * ratio);
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * ratio);
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * ratio);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  const onMeetingPress = (rowIndex: number, colIndex: number) => {
    if(leader == userId)
    {
      const day = getDateRange()[colIndex]; // colIndex로 요일 가져오기
      const time = times[rowIndex]; // rowIndex로 시간 가져오기
      setSelectedDay(day);
      setSelectedTime(time);
      setSelectTimePopupVisible(true); // 회의 시간 선택 팝업 열기
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchSchedules(); // 토큰이 있을 때만 프로젝트 목록을 가져옴
    }
  }, [accessToken]);

  const handleSelectTimeConfirm = async () => {
    console.log(`회의 시간: ${selectedDay} ${selectedTime}`); // 선택된 회의 시간 출력

    try {
      const response = await fetch(`http://ec2-43-201-54-81.ap-northeast-2.compute.amazonaws.com:3000/projects/${projectId}/schedule/makeMeet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          duedate: `${selectedDay} ${selectedTime}`, 
        }),
      });

      if (response.ok) {
        Alert.alert("성공", "미팅이 설정되었습니다.");try {
        await sendNotification(projectId, `미팅이 ${selectedDay} ${selectedTime}으로 설정되었습니다.`, [userId], accessToken);
          console.log("알림이 성공적으로 전송되었습니다.");
        } catch (error) {
          console.error("알림 전송 중 오류 발생:", error);
        }
      } else {
        const errorData = await response.json();
        Alert.alert("오류", errorData.message || "미팅 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("API 요청 오류:", error);
      Alert.alert("에러", "미팅 등록 중 네트워크 오류가 발생했습니다.");
    }

    setSelectTimePopupVisible(false); // 팝업 닫기
  };

  const handleSelectTimeCancel = () => {
    setSelectTimePopupVisible(false); // 팝업 닫기
  };

  const openInsertSchedulePopup = async (newSelectedCells: Map<string, number>) => {
    setSelectedCells(newSelectedCells)
    setInsertSchedulePopupVisible(false); // InsertSchedulePopup 열기
    await fetchSchedules();
  };

  const closeInsertSchedulePopup = async () => {
    setInsertSchedulePopupVisible(false); // InsertSchedulePopup 닫기
    await fetchSchedules();
  };

  const handleButtonPress = (button: "calendar" | "member" | "schedule") => {
    setActiveButton(button);
    if (button === "calendar") {
      onCalendarPress();
    } else if (button === "member") {
      onMemberPress();
    } else if (button === "schedule") {
      onSchedulePress();
    }
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

      {/* 스크롤 가능한 시간표 */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.tableContainer}>
          {/* 상단 네비게이션 (이전, 현재 주, 다음 버튼) */}
          <View style={styles.navigationContainer}>
            <TouchableOpacity onPress={() => changeDate("prev")} style={styles.navButton}>
              <Text style={styles.navButtonText}>〈</Text>
            </TouchableOpacity>

            <Text style={styles.currentWeekText}>
              {format(getDateRange()[0], "yyyy년 MM월 dd일")} - {format(getDateRange()[6], "MM월 dd일")}
            </Text>

            <TouchableOpacity onPress={() => changeDate("next")} style={styles.navButton}>
              <Text style={styles.navButtonText}>〉</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.headerCell}></Text>
            {days.map((day, index) => (
              <Text key={index} style={styles.headerCell}>
                {day}
              </Text>
            ))}
          </View>
          {times.map((time, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              <Text style={styles.timeCell}>{time}</Text>
              {days.map((_, colIndex) => {
                const cellKey = `${rowIndex}-${colIndex}`;
                const count = selectedCells.get(cellKey) || 0; // 중복 카운트를 가져옴
                const backgroundColor = calculateCellColor(count); // 색상 계산

                return (
                  <TouchableOpacity
                    key={colIndex}
                    style={[styles.cell, { backgroundColor }]} // 스타일을 TouchableOpacity에 직접 추가
                    onLongPress={() => onMeetingPress(rowIndex, colIndex)} // rowIndex와 colIndex 전달
                  >
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 팝업 모달 */}
      <Modal visible={isSelectTimePopupVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.popupContent}>
            <Text style={styles.popupTitle}>회의 시간 설정</Text>
            <Text style={styles.popupMessage}>
              {selectedDay} {selectedTime}을 회의 시간으로 하시겠습니까?
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.actionButton} onPress={handleSelectTimeConfirm}>
                <Text style={styles.buttonText}>확인</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={handleSelectTimeCancel}>
                <Text style={styles.buttonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 시간 등록 버튼 (고정) */}
      <View style={styles.fixedButtonContainer}>
      <TouchableOpacity style={styles.actionButton} onPress={async () => {
        await fetchSchedules();
        setInsertSchedulePopupVisible(true);
      }}>
        <Text style={styles.buttonText}>스케줄 등록</Text>
      </TouchableOpacity>
      </View>

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

      {/* 팝업 */}
      {isInsertSchedulePopupVisible && (
        <InsertSchedulePopup
          initialSelectedCells={new Map(selectedCells)}
          onClose={closeInsertSchedulePopup}
          onConfirm={openInsertSchedulePopup}
          dateRange={getDateRange()}
        />
      )}
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
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
  },
  navButton: {
    paddingHorizontal: 20,
  },
  navButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  currentWeekText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  scrollContainer: {
    paddingBottom: 100, // 하단에 버튼이 겹치지 않도록 여백을 추가
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
  tableContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    height: 40,
  },
  headerCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
  },
  timeCell: {
    width: 50,
    textAlign: "center",
    fontSize: 12,
    color: "#333333",
    paddingVertical: 8,
  },
  cell: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: "#CCCCCC",
  },
  selectedCell: {
    backgroundColor: "green",
  },// 팝업 관련 스타일
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popupContent: {
    width: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  popupMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    backgroundColor: "#003C8F",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginHorizontal: 8,
    alignItems: 'center', // 텍스트를 중앙에 맞추기
    justifyContent: 'center', // 텍스트를 중앙에 맞추기
  },
  cancelButton: {
    backgroundColor: "#A0A0A0",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 60, // 시간 등록 버튼 위치를 고정
    left: 16,
    right: 16,
    paddingBottom: 16,
    zIndex: 10,
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
});

export default ScheduleLobbyScreen;

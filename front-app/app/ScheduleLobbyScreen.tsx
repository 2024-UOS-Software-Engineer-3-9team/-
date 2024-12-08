import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import InsertSchedulePopup from "./InsertSchedulePopup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useProject } from './context/ProjectContext';

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
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [activeButton, setActiveButton] = useState<"calendar" | "member" | "schedule">("schedule");
  const { projectId, leader, setProjectId, setLeader } = useProject();

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

  const getCellsFromSchedule = (schedules: Schedule[]): Set<string> => {
    const selectedCells = new Set<string>();

    console.log(selectedCells);
  
    // schedules를 순회하면서 1인 값의 인덱스를 찾음
    for(let i=0; i<schedules.length; i++)
    {
      for (let j = 0; j < 24; j++) {
        if (schedules[i].TIME[j] === '1') {
          selectedCells.add(`${j}-${i}`); // 1이 있는 인덱스를 'j-i' 형태로 저장
        }
      }
    }
  
    return selectedCells;
  };

  useEffect(() => {
    if (schedules.length > 0)
    {
      setSelectedCells(getCellsFromSchedule(schedules));
      // console.log(schedules[0].TIME[5]);
    }
  }, [schedules])

  const fetchSchedules = async() => {
    try {
      const response = await fetch(`http://ec2-43-201-54-81.ap-northeast-2.compute.amazonaws.com:3000/projects/${projectId}/schedules?start_day=2024-12-01&end_day=2024-12-08`, {
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

  useEffect(() => {
    if (accessToken) {
      fetchSchedules(); // 토큰이 있을 때만 프로젝트 목록을 가져옴
    }
  }, [accessToken]);

  const handleConfirm = async (newSelectedCells: Set<string>) => {
    setSelectedCells(newSelectedCells);
    setPopupVisible(false);
  };

  const handleCancel = () => {
    setPopupVisible(false);
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
                const isSelected = selectedCells.has(cellKey);
                return (
                  <View
                    key={colIndex}
                    style={[styles.cell, isSelected && styles.selectedCell]}
                  ></View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 시간 등록 버튼 (고정) */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => setPopupVisible(true)}>
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
      {isPopupVisible && (
        <InsertSchedulePopup
          initialSelectedCells={selectedCells}
          onClose={handleCancel}
          onConfirm={handleConfirm}
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
  },
  actionButton: {
    backgroundColor: "#003C8F",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
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

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useProject } from './context/ProjectContext';

interface InsertSchedulePopupProps {
  onClose: () => void; // 팝업 닫기 콜백
  initialSelectedCells: Map<string, number>; // 부모에서 전달된 기존 선택 상태
  onConfirm: (selectedCells: Map<string, number>) => void; // 확인 버튼 콜백
  dateRange: string[];
}

const InsertSchedulePopup: React.FC<InsertSchedulePopupProps> = ({
  onClose,
  initialSelectedCells,
  onConfirm,
  dateRange,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  // const days = ["11/4", "11/5", "11/6", "11/7", "11/8", "11/9", "11/10"];
  const times = [...Array(24)].map((_, i) => `${i}:00`);
  const [selectedCells, setSelectedCells] = useState<Map<string, number>>(new Map());
  const { projectId, leader, setProjectId, setLeader } = useProject();

  // 팝업이 열릴 때 초기 상태 설정
  useEffect(() => {
    if(selectedCells)
    {
      setSelectedCells(selectedCells);
    }
    else
    {
      setSelectedCells(new Map(initialSelectedCells));
    }
  }, [initialSelectedCells]);

  const toggleCell = (cellKey: string) => {
    setSelectedCells((prev) => {
      const newMap = new Map(prev); // 기존 맵 복사
      const currentCount = newMap.get(cellKey) || 0; // 현재 카운트 가져오기
  
      if (currentCount > 0) {
        if (currentCount === 1) {
          newMap.delete(cellKey); // 카운트가 1이면 셀 제거 (선택 취소)
        } else {
          newMap.set(cellKey, currentCount - 1); // 카운트 감소
        }
      } else {
        newMap.set(cellKey, 1); // 처음 선택 시 카운트 1로 초기화
      }
  
      return newMap;
    });
  };

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

  const generateScheduleBinary = (selectedCells: Map<string, number>): string[] => {
    const daysCount = 7; // 요일 수 (열의 개수)
    const hoursCount = 24; // 시간 수 (행의 개수)
  
    const scheduleBinary = Array.from({ length: daysCount }, () => "0".repeat(hoursCount));
  
    selectedCells.forEach((count, cellKey) => {
      const [row, col] = cellKey.split("-").map(Number); // row = 시간, col = 요일
      if (col >= 0 && col < daysCount && row >= 0 && row < hoursCount) {
        const binaryString = scheduleBinary[col];
        scheduleBinary[col] =
          binaryString.substring(0, row) + "1" + binaryString.substring(row + 1);
      }
    });
  
    return scheduleBinary;
  };  

  const handleConfirm = async () => {
    const binarySchedule = generateScheduleBinary(selectedCells);
    console.log(dateRange);
    for(let i = 0; i < 7; i++) {
      try {
        const response = await fetch(
          `http://ec2-43-201-54-81.ap-northeast-2.compute.amazonaws.com:3000/projects/${projectId}/addschedule`, 
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              time: binarySchedule[i],
              date_meet: dateRange[i],
            }),
          }
        );
  
        if (response.ok) {
          const result = await response.text();
          Alert.alert("성공", "스케줄이 저장되었습니다.");
        } else {
          const errorData = await response.text();
          Alert.alert("오류", errorData || "스케줄 저장에 실패했습니다.");
        }
      } catch (error) {
        console.error("API 요청 오류:", error);
        Alert.alert("에러", "스케줄 저장 중 네트워크 오류가 발생했습니다.");
      }
    }
    onConfirm(selectedCells); // 🟢 Map<string, number> 전달
  };
  

  return (
    <Modal transparent={true} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.popupContent}>
          <Text style={styles.popupTitle}>2024.11</Text>

          {/* 시간표 */}
          <ScrollView style={styles.table}>
            <View style={styles.row}>
              <Text style={styles.headerCell}></Text>
              {dateRange.map((day, index) => (
                <Text key={index} style={styles.headerCell}>
                  {day}
                </Text>
              ))}
            </View>
            {times.map((time, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                <Text style={styles.timeCell}>{time}</Text>
                {dateRange.map((_, colIndex) => {
                  const cellKey = `${rowIndex}-${colIndex}`;
                  const isSelected = selectedCells.has(cellKey);
                  return (
                    <TouchableOpacity
                      key={colIndex}
                      style={[styles.cell, isSelected && styles.selectedCell]}
                      onPress={() => toggleCell(cellKey)}
                    />
                  );
                })}
              </View>
            ))}
          </ScrollView>

          {/* 버튼 */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleConfirm} // 선택된 상태 전달
            >
              <Text style={styles.buttonText}>확인</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popupContent: {
    width: "90%",
    height: "90%", // 화면 크기를 90%로 제한
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    flexDirection: "column", // 세로 방향으로 배치
  },
  popupTitle: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  table: {
    flex: 1, // 테이블을 스크롤할 수 있도록 만듦
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    height: 40,
  },
  headerCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
  },
  timeCell: {
    width: 50,
    textAlign: "center",
    fontSize: 12,
    color: "#333333",
  },
  cell: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: "#CCCCCC",
  },
  selectedCell: {
    backgroundColor: "green",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    backgroundColor: "#003C8F",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#A0A0A0",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
});

export default InsertSchedulePopup;

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface InsertSchedulePopupProps {
  onClose: () => void; // 팝업 닫기 콜백
  initialSelectedCells: Set<string>; // 부모에서 전달된 기존 선택 상태
  onConfirm: (selectedCells: Set<string>) => void; // 확인 버튼 콜백
}

const InsertSchedulePopup: React.FC<InsertSchedulePopupProps> = ({
  onClose,
  initialSelectedCells,
  onConfirm,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const days = ["11/4", "11/5", "11/6", "11/7", "11/8", "11/9", "11/10"];
  const times = [...Array(24)].map((_, i) => `${i}:00`);
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());

  // 팝업이 열릴 때 초기 상태 설정
  useEffect(() => {
    setSelectedCells(new Set(initialSelectedCells));
  }, [initialSelectedCells]);

  const toggleCell = (cellKey: string) => {
    setSelectedCells((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cellKey)) {
        newSet.delete(cellKey);
      } else {
        newSet.add(cellKey);
      }
      return newSet;
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

  const generateScheduleBinary = (selectedCells: Set<string>): string[] => {
    const daysCount = 7; // 요일 수
    const hoursCount = 24; // 시간 수
  
    // 초기화된 빈 배열 (요일별로 24개의 "0"으로 시작)
    const scheduleBinary = Array(daysCount).fill("0".repeat(hoursCount));
  
    // `selectedCells` 데이터를 순회하며 클릭된 상태를 업데이트
    selectedCells.forEach((cellKey) => {
      const [row, col] = cellKey.split("-").map(Number); // 행(row)은 시간, 열(col)은 요일
      if (col >= 0 && col < daysCount && row >= 0 && row < hoursCount) {
        const binaryString = scheduleBinary[col];
        // 해당 시간(row) 위치를 "1"로 변경
        scheduleBinary[col] =
          binaryString.substring(0, row) + "1" + binaryString.substring(row + 1);
      }
    });
  
    return scheduleBinary;
  };

  const handleConfirm = async () => {
    try {
      const binarySchedule = generateScheduleBinary(selectedCells);

      console.log(binarySchedule);
      const response = await fetch("ec2-43-201-54-81.ap-northeast-2.compute.amazonaws.com:3000/projects/${projectId}/addschedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          time: binarySchedule[0],
          data_meet: "2024-12-05",
        }),
      });

      if (response.ok) {
        const result = await response.json();
        Alert.alert("성공", "스케줄이 저장되었습니다.");
        
      } else {
        const errorData = await response.json();
        Alert.alert("오류", errorData.message || "스케줄 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("API 요청 오류:", error);
      Alert.alert("에러", "스케줄 저장 중 네트워크 오류가 발생했습니다.");
    } finally {
      onConfirm(selectedCells); // 상태 전달 및 팝업 닫기
    }
  };

  return (
    <Modal transparent={true} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.popupContent}>
          <Text style={styles.popupTitle}>2024.11</Text>

          {/* 시간표 */}
          <View style={styles.table}>
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
                    <TouchableOpacity
                      key={colIndex}
                      style={[styles.cell, isSelected && styles.selectedCell]}
                      onPress={() => toggleCell(cellKey)}
                    />
                  );
                })}
              </View>
            ))}
          </View>

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
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
  },
  popupTitle: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  table: {
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

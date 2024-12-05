import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import InsertSchedulePopup from "./InsertSchedulePopup";

interface ScheduleLobbyScreenProps {
  onBackPress: () => void;
}

const days = ["월", "화", "수", "목", "금", "토", "일"];
const times = [...Array(24)].map((_, i) => `${i}:00`);

const ScheduleLobbyScreen: React.FC<ScheduleLobbyScreenProps> = ({ onBackPress }) => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set()); // 전체 선택 상태

  const handleConfirm = (newSelectedCells: Set<string>) => {
    setSelectedCells(newSelectedCells); // 팝업에서 선택된 상태 저장
    setPopupVisible(false); // 팝업 닫기
  };

  const handleCancel = () => {
    setPopupVisible(false); // 팝업 닫기, 선택 상태 유지
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackPress}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>일조매 개발</Text>
      </View>

      {/* 시간표 */}
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

      {/* 등록 버튼 */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionButton} onPress={() => setPopupVisible(true)}>
          <Text style={styles.buttonText}>시간 등록</Text>
        </TouchableOpacity>
      </View>

      {/* 팝업 */}
      {isPopupVisible && (
        <InsertSchedulePopup
          initialSelectedCells={selectedCells} // 기존 상태 전달
          onClose={handleCancel} // 취소 시 팝업 닫기
          onConfirm={handleConfirm} // 확인 시 상태 저장
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
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 8,
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
    backgroundColor: "green", // 선택된 셀 강조
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#003C8F",
    padding: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
});

export default ScheduleLobbyScreen;

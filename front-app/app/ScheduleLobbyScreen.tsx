import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";

interface ScheduleLobbyScreenProps {
  onBackPress: () => void;
  onOpenPopup: () => void; // 팝업 열기 콜백
}

const days = ["월", "화", "수", "목", "금", "토", "일"];
const times = [...Array(24)].map((_, i) => `${i}:00`);

const ScheduleLobbyScreen: React.FC<ScheduleLobbyScreenProps> = ({
  onBackPress,
  onOpenPopup,
}) => {
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
          <Text style={styles.headerCell}></Text> {/* 빈 셀 */}
          {days.map((day, index) => (
            <Text key={index} style={styles.headerCell}>
              {day}
            </Text>
          ))}
        </View>
        {times.map((time, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            <Text style={styles.timeCell}>{time}</Text>
            {days.map((_, colIndex) => (
              <TouchableOpacity key={colIndex} style={styles.cell}></TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      {/* 등록 및 미팅 시간 버튼 */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionButton} onPress={onOpenPopup}>
          <Text style={styles.buttonText}>등록</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onOpenPopup}>
          <Text style={styles.buttonText}>미팅 시간 정하기</Text>
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

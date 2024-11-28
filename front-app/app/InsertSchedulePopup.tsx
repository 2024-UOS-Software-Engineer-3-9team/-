import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";

interface InsertSchedulePopupProps {
  onClose: () => void;
}

const InsertSchedulePopup: React.FC<InsertSchedulePopupProps> = ({ onClose }) => {
  const days = ["11/4", "11/5", "11/6", "11/7", "11/8", "11/9", "11/10"];
  const times = [...Array(24)].map((_, i) => `${i}:00`);

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
                {days.map((_, colIndex) => (
                  <View key={colIndex} style={styles.cell}></View>
                ))}
              </View>
            ))}
          </View>

          {/* 버튼 */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.actionButton} onPress={onClose}>
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

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";

const alarms = [
  { id: "1", content: "자료 조사 마감 기한 연장 11.30 → 12.2", isNew: true },
  { id: "2", content: "미팅 일정 잡기가 완료되었습니다.", isNew: true },
  { id: "3", content: "누군가가 '미팅 일정 잡기'를 좀 빨리 하라고 독촉합니다.", isNew: true },
];

interface AlarmTeamScreenProps {
  onBackPress: () => void; // 뒤로 가기 콜백 추가
}

const AlarmTeamScreen: React.FC<AlarmTeamScreenProps> = ({ onBackPress }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false); // 팝업 표시 상태
  const [alarmText, setAlarmText] = useState(""); // 새로운 알림 텍스트

  const handleAddAlarm = () => {
    if (alarmText.trim()) {
      alarms.push({ id: Date.now().toString(), content: alarmText, isNew: true });
      setAlarmText(""); // 입력값 초기화
      setIsPopupVisible(false); // 팝업 닫기
    }
  };

  return (
    <View style={styles.container}>
      {/* 뒤로 가기 버튼 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>알림 목록</Text>
      </View>

      {/* 알림 목록 */}
      {alarms.map((alarm) => (
        <Text key={alarm.id} style={styles.alarmText}>
          {alarm.isNew && <Text style={styles.newTag}>NEW </Text>}
          {alarm.content}
        </Text>
      ))}

      {/* 버튼들 */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsPopupVisible(true)} // 팝업 열기
        >
          <Text style={styles.addButtonText}>추가</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>확인</Text>
        </TouchableOpacity>
      </View>

      {/* 팝업 구현 */}
      <Modal
        visible={isPopupVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsPopupVisible(false)} // 뒤로가기 버튼 처리
      >
        <View style={styles.popupContainer}>
          <Text style={styles.popupTitle}>알림 내용 입력</Text>
          <TextInput
            style={styles.input}
            placeholder="알림 내용을 입력하세요"
            value={alarmText}
            onChangeText={setAlarmText}
          />
          <TouchableOpacity style={styles.popupConfirmButton} onPress={handleAddAlarm}>
            <Text style={styles.popupConfirmButtonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  backButtonText: {
    color: "#4A90E2",
    fontSize: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  alarmText: {
    fontSize: 14,
    marginBottom: 8,
    color: "#000000",
  },
  newTag: {
    color: "#FF0000",
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  addButton: {
    backgroundColor: "#4A90E2",
    padding: 12,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: "#4A4A4A",
    padding: 12,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  popupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 투명한 배경
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#FFFFFF",
  },
  input: {
    width: "80%",
    height: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    marginBottom: 16,
  },
  popupConfirmButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  popupConfirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default AlarmTeamScreen;

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert } from "react-native";
import { format } from "date-fns";

interface GenerateTaskScreenProps {
  visible: boolean;
  onClose: () => void;
  onSave: (task: { deadline: string; assignees: string[] }) => void;
}

const GenerateTaskScreen: React.FC<GenerateTaskScreenProps> = ({ visible, onClose, onSave }) => {
  const [deadline, setDeadline] = useState("");
  const [assignees, setAssignees] = useState<string[]>([]);
  const [newAssignee, setNewAssignee] = useState("");

  const handleAddAssignee = () => {
    if (newAssignee.trim()) {
      setAssignees([...assignees, newAssignee.trim()]);
      setNewAssignee(""); // 입력 필드 초기화
    } else {
      Alert.alert("경고", "할당인원을 입력해주세요.");
    }
  };

  const handleSaveTask = () => {
    if (!deadline || assignees.length === 0) {
      Alert.alert("경고", "마감기한과 할당인원을 모두 입력해주세요.");
    } else {
      // onSave({ deadline, assignees });
      console.log(deadline);
      onClose(); // 팝업 닫기
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>작업 생성</Text>

          {/* 마감기한 입력 */}
          <Text style={styles.label}>마감기한</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={deadline}
            onChangeText={setDeadline}
          />

          {/* 할당인원 입력 */}
          <Text style={styles.label}>할당인원</Text>
          <View style={styles.assigneesContainer}>
            <TextInput
              style={styles.input}
              placeholder="할당인원 입력"
              value={newAssignee}
              onChangeText={setNewAssignee}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddAssignee}>
              <Text style={styles.addButtonText}>추가</Text>
            </TouchableOpacity>
          </View>

          {/* 할당인원 목록 */}
          <View style={styles.assigneesList}>
            {assignees.map((assignee, index) => (
              <Text key={index} style={styles.assigneeItem}>
                {assignee}
              </Text>
            ))}
          </View>

          {/* 버튼들 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>뒤로가기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSaveTask}>
              <Text style={styles.buttonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "80%",
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
    marginBottom: 16,
  },
  assigneesContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#4A90E2",
    padding: 10,
    borderRadius: 5,
    marginLeft: 8,
  },
  addButtonText: {
    color: "#fff",
  },
  assigneesList: {
    marginBottom: 16,
  },
  assigneeItem: {
    fontSize: 14,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default GenerateTaskScreen;

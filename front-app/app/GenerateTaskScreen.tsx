import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useProject } from './context/ProjectContext';
import { format } from 'date-fns';

interface GenerateTaskScreenProps {
  visible: boolean;
  onClose: () => void;
  onSave: (task: { deadline: string; assignees: string[] }) => void;
}

const GenerateTaskScreen: React.FC<GenerateTaskScreenProps> = ({ visible, onClose, onSave }) => {
  const [deadline, setDeadline] = useState("");
  const [assignees, setAssignees] = useState<string[]>([]);
  const [newAssignee, setNewAssignee] = useState("");
  const [taskName, setTaskName] = useState("");
  const { projectId } = useProject();
  const [accessToken, setAccessToken] = useState<string | null>(null);

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

  const handleAddAssignee = () => {
    if (newAssignee.trim() && !assignees.includes(newAssignee.trim())) {
      setAssignees([...assignees, newAssignee.trim()]);
      setNewAssignee("");
    } else if (!newAssignee.trim()) {
      Alert.alert("경고", "할당인원을 입력해주세요.");
    } else {
      Alert.alert("경고", "중복된 할당인원입니다.");
    }
  };

  const handleSaveTask = async () => {
    if (!taskName.trim() || !deadline || assignees.length === 0) {
      Alert.alert("경고", "작업명, 마감기한, 할당인원을 모두 입력해주세요.");
      return;
    }

    if (!accessToken) {
      Alert.alert("오류", "로그인이 필요합니다. 다시 로그인 해주세요.");
      return;
    }

    if (!projectId) {
      Alert.alert("오류", "프로젝트 ID가 유효하지 않습니다.");
      return;
    }

    const requestBody = {
      task_name: taskName.trim(),
      duedate: deadline, // duedate 포맷을 "YYYY-MM-DD"로 변환
      user_ids: assignees,
    };
    console.log('보내는 데이터:', requestBody); // 확인용 콘솔 로그


    try {
      const response = await fetch(`http://ec2-43-201-54-81.ap-northeast-2.compute.amazonaws.com:3000/projects/${projectId}/tasks/make`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        const errorDetails = JSON.parse(errorMessage);
        console.error('서버 오류 메시지:', errorDetails);
        Alert.alert('서버 오류', errorDetails.message || "작업 생성 중 오류가 발생했습니다.");
        return;
      }

      const responseData = await response.json();
      console.log('서버 응답:', responseData);
      Alert.alert("성공", "작업이 성공적으로 저장되었습니다.");
      onSave({ deadline, assignees });
      onClose();
    } catch (error) {
      console.error('작업 생성 중 오류 발생:', error);
      Alert.alert("오류", "작업 생성 중 오류가 발생했습니다.");
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

          {/* 작업명 입력 */}
          <Text style={styles.label}>작업명</Text>
          <TextInput
            style={styles.input}
            placeholder="작업명을 입력하세요"
            value={taskName}
            onChangeText={setTaskName}
          />

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

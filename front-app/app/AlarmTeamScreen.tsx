import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useProject } from './context/ProjectContext';
import { sendNotification } from './api/notification';

interface Alarm {
  NOTICE_ID: number;
  MESSAGE: string;
  DUEDATE: string;
}

interface AlarmTeamScreenProps {
  onBackPress: () => void; // 뒤로 가기 콜백 추가
}

const AlarmTeamScreen: React.FC<AlarmTeamScreenProps> = ({ onBackPress }) => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false); // 팝업 표시 상태
  const [alarmText, setAlarmText] = useState(""); // 새로운 알림 텍스트
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { userId, projectId } = useProject();

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
    fetchAlarms();
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchAlarms(); // 토큰이 있을 때만 프로젝트 목록을 가져옴
    }
  }, [accessToken]);

  // 서버에서 알람 목록을 가져오는 함수
  const fetchAlarms = async () => {
    if (!accessToken) {
      console.log("토큰이 없습니다.");
      return; // 토큰이 없으면 API 호출을 하지 않음
    }

    try {
      const response = await fetch(`http://ec2-43-201-54-81.ap-northeast-2.compute.amazonaws.com:3000/projects/${projectId}/notifications`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`, // 토큰을 Authorization 헤더에 포함
        },
      });

      if (!response.ok) {
        throw new Error("서버 오류");
      }
      
      const data = await response.json();
    
      // 배열을 객체 형태로 변환
      const transformedData = data.map((item: any) => ({
        NOTICE_ID: item[0],
        MESSAGE: item[1],
        DUEDATE: item[2],
      }));

      setAlarms(transformedData); // 데이터를 상태에 저장
    } catch (error) {
      console.error("프로젝트를 가져오는 중 오류 발생:", error);
    }
  };

  const handleAddAlarm = async () => {
    if(alarmText.trim()) {
      try {
        await sendNotification(projectId, alarmText, [userId], accessToken);
        console.log("알림이 성공적으로 전송되었습니다.");
      } catch (error) {
        console.error("알림 전송 중 오류 발생:", error);
      }
  
      setAlarmText(""); // 입력값 초기화
      setIsPopupVisible(false); // 팝업 닫기
    }
  }

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
        <Text key={alarm.NOTICE_ID} style={styles.alarmText}>
          {/* {alarm.isNew && <Text style={styles.newTag}>NEW </Text>} */}
          {`${alarm.DUEDATE.slice(0, 10)}: ${alarm.MESSAGE}`}
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
    width: "100%",
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

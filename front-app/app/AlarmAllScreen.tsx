import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useProject } from './context/ProjectContext';

interface Alarm {
  PROJ_ID: number,
  NOTICE_ID: number,
  MESSAGE: string;
  DUEDATE: string;
  PROJ_NAME: string,
}

interface AlarmAllScreenProps {
  onBackPress: () => void; // 뒤로 가기 콜백 추가
}

const AlarmAllScreen: React.FC<AlarmAllScreenProps> = ({ onBackPress }) => {
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
      const response = await fetch(`http://ec2-43-201-54-81.ap-northeast-2.compute.amazonaws.com:3000/home/notifications`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`, // 토큰을 Authorization 헤더에 포함
        },
      });

      const data = await response.json();
    
      // 배열을 객체 형태로 변환
      const transformedData = data.map((item: any) => ({
        PROJ_ID: item[0],
        NOTICE_ID: item[1],
        MESSAGE: item[2],
        DUEDATE: item[3],
        PROJ_NAME: item[4],
      }));

      setAlarms(transformedData); // 데이터를 상태에 저장
    } catch (error) {
      console.error("프로젝트를 가져오는 중 오류 발생:", error);
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
        <Text key={alarm.NOTICE_ID} style={styles.alarmText}>
          {/* {alarm.isNew && <Text style={styles.newTag}>NEW </Text>} */}
          {`${alarm.PROJ_NAME}: ${alarm.DUEDATE.slice(0, 10)}: ${alarm.MESSAGE}`}
        </Text>
      ))}


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

export default AlarmAllScreen;

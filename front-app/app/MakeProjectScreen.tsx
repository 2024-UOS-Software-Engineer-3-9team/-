import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MakeProjectScreenProps {
  onBackPress: () => void;
}

const MakeProjectScreen: React.FC<MakeProjectScreenProps> = ({ onBackPress }) => {
  const [projName, setProjName] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null);

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

  const createProject = async () => {
    if (!projName.trim()) {
      Alert.alert("알림", "프로젝트 이름을 입력해주세요.");
      return;
    }

    if (!accessToken) {
      Alert.alert("오류", "유효하지 않은 토큰입니다. 다시 로그인 해주세요.");
      return;
    }

    try {
      const response = await fetch(
        "http://ec2-43-201-54-81.ap-northeast-2.compute.amazonaws.com:3000/home/newprojects",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // 토큰 추가
          },
          body: JSON.stringify({ proj_name: projName }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        Alert.alert("성공", data.message);
      } else {
        const errorData = await response.json();
        Alert.alert("실패", errorData.message || "프로젝트 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("에러", "네트워크 오류가 발생했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>팀 프로젝트 만들기</Text>
      <Text style={styles.description}>
        텍스트로 설명 간단하게 적어서 이 공간을 채우면 될 것 같습니다.{"\n"}
        Proj_ID, Proj_name, Leader ID를 받아 저장해야 하는데{"\n"}딱히 여기서 더 받을 정보가 없을 것 같습니다.
        {"\n"}초대는 프로젝트를 만든 후에 한 명씩 진행하는 것이 좋아보입니다.
      </Text>

      <Text style={styles.inputLabel}>팀 프로젝트 이름</Text>
      <TextInput
        style={styles.input}
        placeholder="팀 프로젝트 이름 입력"
        placeholderTextColor="#C4C4C4"
        value={projName}
        onChangeText={setProjName}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <Text style={styles.backButtonText}>뒤로가기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton} onPress={createProject}>
          <Text style={styles.confirmButtonText}>확인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#4A90E2",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 20,
    lineHeight: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  backButtonText: {
    color: "#0066FF",
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  confirmButtonText: {
    color: "#0066FF",
    fontSize: 16,
  },
});

export default MakeProjectScreen;

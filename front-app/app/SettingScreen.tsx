import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Switch, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SettingScreenProps {
  onBackPress: () => void;
}

const SettingScreen: React.FC<SettingScreenProps> = ({ onBackPress }) => {
  const [newNickname, setNewNickname] = useState<string>("");
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

  const updateNickname = async () => {
    if (!newNickname.trim()) {
      Alert.alert("오류", "닉네임을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch('http://ec2-43-201-54-81.ap-northeast-2.compute.amazonaws.com:3000/auth/mynickname', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ nickname: newNickname }),
      });

      const responseText = await response.text();

      if (response.ok) {
        Alert.alert("성공", "닉네임이 성공적으로 변경되었습니다.");
      } else if (response.status === 400) {
        Alert.alert("오류", "닉네임이 비어 있을 수 없습니다.");
      } else if (response.status === 404) {
        Alert.alert("오류", "사용자를 찾을 수 없습니다.");
      } else {
        Alert.alert("오류", responseText || "알 수 없는 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("API 요청 오류:", error);
      Alert.alert("에러", "닉네임 변경 중 네트워크 오류가 발생했습니다.");
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>알람 설정이 꺼져 있으면</Text>
      <Text style={styles.subtitle}>다른 팀원들로부터 알람을 받을 수 없어요....</Text>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>알람 설정</Text>
        <Switch />
      </View>
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>기타 설정</Text>
        <Switch />
      </View>
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>기타 설정</Text>
        <Switch />
      </View>

      <Text style={styles.nickname}>현재 닉네임: 집가고싶다</Text>

      <TextInput
        style={styles.input}
        placeholder="바꿀 닉네임을 입력해 주세요"
        placeholderTextColor="#C4C4C4"
        value={newNickname} // 닉네임 입력값을 상태로 관리
        onChangeText={setNewNickname} // 입력이 변경되면 newNickname을 업데이트
      />

      <TouchableOpacity style={styles.confirmButton} onPress={updateNickname}>
        <Text style={styles.confirmButtonText}>확인</Text>
      </TouchableOpacity> 

      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <Text style={styles.backButtonText}>이전 화면으로</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#000000",
    marginBottom: 20,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: "#000000",
  },
  nickname: {
    fontSize: 14,
    color: "#000000",
    marginVertical: 20,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#C4C4C4",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 14,
  },
  confirmButton: {
    backgroundColor: "#C4C4C4",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  confirmButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  backButton: {
    backgroundColor: "#0066FF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
});

export default SettingScreen;

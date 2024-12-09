import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface InviteScreenProps {
  projId: string; // 프로젝트 ID를 prop으로 받음
  onBackPress: () => void;
}

const InviteScreen: React.FC<InviteScreenProps> = ({ onBackPress, projId }) => {
  const [userId, setUserId] = useState("");
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

  const inviteUser = async () => {
    if (!userId.trim()) {
      Alert.alert("알림", "초대할 팀원의 아이디를 입력해주세요.");
      return;
    }

    if (!accessToken) {
      Alert.alert("오류", "유효하지 않은 토큰입니다. 다시 로그인 해주세요.");
      return;
    }

    try {
      const response = await fetch(
        `http://ec2-43-201-54-81.ap-northeast-2.compute.amazonaws.com:3000/projects/${projId}/invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ user_id: userId }),
        }
      );

      if (response.status === 201) {
        Alert.alert("성공", "팀원이 성공적으로 초대되었습니다.");
        onBackPress();
      } else if (response.status === 400) {
        const errorData = await response.json();
        Alert.alert("실패", errorData.message || "초대 요청이 실패했습니다.");
      } else {
        Alert.alert("실패", "알 수 없는 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("에러", "네트워크 오류가 발생했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackPress}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>팀 프로젝트 인원 초대</Text>
      </View>
      <Text style={styles.label}>초대할 인원 아이디</Text>
      <TextInput
        style={styles.input}
        placeholder="아이디 입력"
        placeholderTextColor="#C4C4C4"
        value={userId}
        onChangeText={setUserId}
      />
      <Text style={styles.label}>이 사람이 맞나요?</Text>
      <View style={styles.previewBox}>
        <Text>서울시대학교 재학생</Text>
        <Text>좋은 소개 잘 부탁드립니다</Text>
      </View>
      <TouchableOpacity style={styles.confirmButton} onPress={inviteUser}>
        <Text style={styles.confirmButtonText}>확인</Text>
      </TouchableOpacity>
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
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    color: "#FFFFFF",
    fontSize: 20,
    marginRight: 16,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  label: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  previewBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#4A90E2",
    fontSize: 16,
  },
});

export default InviteScreen;

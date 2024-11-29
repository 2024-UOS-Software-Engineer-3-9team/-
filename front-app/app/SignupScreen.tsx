import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";

interface SignupScreenProps {
  onSignupComplete: () => void;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ onSignupComplete }) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (!userId || !password || !confirmPassword) {
      Alert.alert("Error", "모든 필드를 입력해 주세요.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch("ec2-43-201-54-81.ap-northeast-2.compute.amazonaws.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          password: password,
          nickname: userId, // 닉네임은 ID로
        }),
      });

      if (response.status === 201) {
        Alert.alert("Success", "회원가입이 완료되었습니다.");
        setUserId("");
        setPassword("");
        setConfirmPassword("");

        console.log("HTTP Status:", response.status); // HTTP 응답 상태 코드 출력
        const data = await response.text();
        console.log("Response Body:", data); // 응답 본문 출력

        if (onSignupComplete) {
          onSignupComplete(); // 추가 동작 호출
        }
      } else {
        const errorMessage = await response.text();
        Alert.alert("Error", `서버 오류: ${errorMessage}`);
      }
    } catch (error) {
      Alert.alert("Error", "서버와 통신 중 문제가 발생했습니다.");
      console.error("Error:", error);
    }
    
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>회원가입_완료</Text>
      </View>

      <Text style={styles.title}>회원가입</Text>

      <Text style={styles.label}>사용할 ID를 입력해 주세요</Text>
      <TextInput
        style={styles.input}
        placeholder="ID"
        placeholderTextColor="#C4C4C4"
        value={userId}
        onChangeText={setUserId}
      />

      <Text style={styles.label}>사용할 비밀번호를 입력해 주세요</Text>
      <TextInput
        style={styles.input}
        placeholder="PASSWORD"
        placeholderTextColor="#C4C4C4"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="PASSWORD (확인)"
        placeholderTextColor="#C4C4C4"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>가입하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 12,
    color: "#A0A0A0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#000000",
    marginBottom: 10,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#C4C4C4",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 14,
    color: "#000000",
  },
  signupButton: {
    backgroundColor: "#4A4A4A",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  signupButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SignupScreen;

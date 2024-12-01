import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


interface LoginScreenProps {
  onSignupPress: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onSignupPress }) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch(`http://ec2-43-201-54-81.ap-northeast-2.compute.amazonaws.com:3000/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          password: password,
        }),
      });

      if (response.status === 201) {
        const data = await response.json();
        const { accessToken } = data;

        // AsyncStorage에 토큰 저장
        await AsyncStorage.setItem("accessToken", accessToken);

        console.log("Saved JWT Token:", accessToken);
      } else if (response.status === 401) {
        Alert.alert("로그인 실패", "아이디 또는 비밀번호를 확인해주세요.");
      } else {
        Alert.alert("오류", "서버에 문제가 발생했습니다.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("네트워크 오류", "서버와 연결할 수 없습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>반가워요!</Text>
      <Text style={styles.subtitle}>서비스 사용을 위해 로그인해주세요.</Text>

      <TextInput
        style={styles.input}
        placeholder="ID"
        placeholderTextColor="#C4C4C4"
        value={userId}
        onChangeText={setUserId}
      />
      <TextInput
        style={styles.input}
        placeholder="PASSWORD"
        placeholderTextColor="#C4C4C4"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signupButton} onPress={onSignupPress}>
        <Text style={styles.signupButtonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 20,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#C4C4C4",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 14,
    color: "#000000",
  },
  loginButton: {
    backgroundColor: "#4A4A4A",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupButton: {
    backgroundColor: "#0066FF",
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

export default LoginScreen;

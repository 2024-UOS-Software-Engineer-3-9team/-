import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";

const SERVER_URI = 'ec2-43-201-54-81.ap-northeast-2.compute.amazonaws.com:3000';

interface LoginScreenProps {
  onSignupPress: () => void;
  onLoginPress: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onSignupPress, onLoginPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>반가워요!</Text>
      <Text style={styles.subtitle}>서비스 사용을 위해 회원가입이 필요합니다.</Text>

      <TouchableOpacity style={styles.signupButton} onPress={onSignupPress}>
        <Text style={styles.signupButtonText}>회원가입</Text>
      </TouchableOpacity>

      <Text style={styles.promptText}>이미 계정이 있으신가요?</Text>

      <TextInput style={styles.input} placeholder="ID" placeholderTextColor="#C4C4C4" />
      <TextInput
        style={styles.input}
        placeholder="PASSWORD"
        placeholderTextColor="#C4C4C4"
        secureTextEntry
      />

      <TouchableOpacity style={styles.loginButton} onPress={onLoginPress}>
        <Text style={styles.loginButtonText}>로그인</Text>
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
  signupButton: {
    backgroundColor: "#0066FF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  signupButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  promptText: {
    fontSize: 14,
    color: "#7E7E7E",
    marginBottom: 10,
    textAlign: "center",
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
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;
import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";

interface SignupScreenProps {
  onSignupComplete: () => void;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ onSignupComplete }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>회원가입_완료</Text>
      </View>

      <Text style={styles.title}>회원가입</Text>

      <Text style={styles.label}>사용할 ID를 입력해 주세요</Text>
      <TextInput style={styles.input} placeholder="ID" placeholderTextColor="#C4C4C4" />

      <Text style={styles.label}>사용할 비밀번호를 입력해 주세요</Text>
      <TextInput
        style={styles.input}
        placeholder="PASSWORD"
        placeholderTextColor="#C4C4C4"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="PASSWORD (확인)"
        placeholderTextColor="#C4C4C4"
        secureTextEntry
      />

      <TouchableOpacity style={styles.signupButton} onPress={onSignupComplete}>
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

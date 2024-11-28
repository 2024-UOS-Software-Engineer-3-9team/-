import React from "react";
import { View, Text, StyleSheet, Switch, TextInput, TouchableOpacity } from "react-native";

interface SettingScreenProps {
  onBackPress: () => void;
}

const SettingScreen: React.FC<SettingScreenProps> = ({ onBackPress }) => {
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
      />

      <TouchableOpacity style={styles.confirmButton}>
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

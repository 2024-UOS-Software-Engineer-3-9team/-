import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";

interface InviteScreenProps {
  onBackPress: () => void;
}

const InviteScreen: React.FC<InviteScreenProps> = ({ onBackPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackPress}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>팀 프로젝트 인원 초대</Text>
      </View>
      <Text style={styles.label}>초대할 인원 아이디</Text>
      <TextInput style={styles.input} placeholder="아이디 입력" placeholderTextColor="#C4C4C4" />
      <Text style={styles.label}>이 사람이 맞나요?</Text>
      <View style={styles.previewBox}>
        <Text>서울시대학교 재학생</Text>
        <Text>좋은 소개 잘 부탁드립니다</Text>
      </View>
      <Text style={styles.label}>역할을 입력해 주세요</Text>
      <TextInput style={styles.input} placeholder="역할 입력" placeholderTextColor="#C4C4C4" />
      <TouchableOpacity style={styles.confirmButton}>
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

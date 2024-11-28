import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface AlarmAllScreenProps {
  onBackPress: () => void;
}

const AlarmAllScreen: React.FC<AlarmAllScreenProps> = ({ onBackPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>알림 목록</Text>
      <View style={styles.notification}>
        <Text style={styles.dot}>•</Text>
        <Text style={styles.notificationText}>
          일을 조금씩 매일매일에 미팅이 등록되었습니다.
        </Text>
      </View>
      <TouchableOpacity style={styles.confirmButton} onPress={onBackPress}>
        <Text style={styles.confirmButtonText}>확인</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  notification: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dot: {
    color: "#FF0000",
    fontSize: 24,
    marginRight: 8,
  },
  notificationText: {
    fontSize: 14,
    color: "#000000",
  },
  confirmButton: {
    backgroundColor: "#000000",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default AlarmAllScreen;

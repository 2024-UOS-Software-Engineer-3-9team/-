import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
// import { useNavigation } from "@react-navigation/native";

const SplashScreen = () => {
//   const navigation = useNavigation();

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       navigation.navigate("Login"); // 2초 후 LoginScreen으로 이동
//     }, 2000);
//     return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 클리어
//   }, [navigation]);


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>스플래쉬_완료</Text>
        <View style={styles.iconPlaceholder} />
      </View>
      <View style={styles.body}>
        <Text style={styles.line1}>일을</Text>
        <Text style={styles.line2}>
          <Text style={styles.bold}>조</Text>금씩
        </Text>
        <Text style={styles.line3}>
          <Text style={styles.bold}>매</Text>일매일
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A90E2', // 파란 배경
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 12,
    color: '#A0A0A0', // 연한 회색
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
    backgroundColor: '#C4C4C4', // 아이콘 자리 표시
    borderRadius: 12,
  },
  body: {
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  line1: {
    fontSize: 32,
    color: '#FFFFFF',
  },
  line2: {
    fontSize: 32,
    color: '#FFFFFF',
  },
  line3: {
    fontSize: 32,
    color: '#FFFFFF',
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default SplashScreen;

import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const sendNotification = async (projectId: string, message: string, userIds: string, accessToken: string) => {
  try {
    const response = await fetch(
      `http://ec2-43-201-54-81.ap-northeast-2.compute.amazonaws.com:3000/projects/${projectId}/makeNotification`, 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`, // 🟢 토큰 추가
        },
        body: JSON.stringify({
          message: message,  // 🟢 알람 메시지
          user_ids: userIds, // 🟢 사용자 ID 리스트
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status}`);
    }

    if(__DEV__ && Constants.appOwnership === 'expo')
    {
      const expoPushToken = await registerForPushNotificationsAsync();
      if (expoPushToken) {
        await pushNotifications(expoPushToken, `test입니다`, message);
      } else {
        console.warn('푸시 토큰이 없습니다.');
      }
    }

    const data = await response.text();
    console.log("알림 성공적으로 전송됨:", data);
    return data; // 성공 시 서버의 응답 데이터 반환
  } catch (error) {
    console.error("알림 전송 중 오류 발생:", error);
    throw error; // 에러를 상위 호출자로 전달
  }
};

export const pushNotifications = async (expoPushToken, title, message) => {
  try {
    const response = await fetch(
      `http://210.101.75.235:3000/push-notification`, 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expoPushToken: expoPushToken,  // 🟢 디바이스의 푸시 토큰
          title: title, // 🟢 알림 제목
          message: message // 🟢 알림 메시지
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status}`);
    }

    const data = await response.json();
    console.log("알림 성공적으로 전송됨:", data);
    return data; // 성공 시 서버의 응답 데이터 반환
  } catch (error) {
    console.error("알림 전송 중 오류 발생:", error);
    throw error; // 에러를 상위 호출자로 전달
  }
};

export async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('푸시 알림 권한이 필요합니다!');
      return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo 푸시 토큰:', token);
  
    // 서버에 푸시 토큰을 저장합니다.
    await fetch('http://210.101.75.235:3000/api/register-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
  
    return token;
  } else {
    alert('푸시 알림은 실제 기기에서만 동작합니다.');
    return null;
  }
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => 
    {let isMounted = true;

    // 개발 환경일 경우, 푸시 알림 전송을 막음
    if (__DEV__ && Constants.appOwnership === 'expo') {
      registerForPushNotificationsAsync().then(token => {
        if (isMounted && token) {
          setExpoPushToken(token);
          console.log('푸시 토큰 등록됨:', token);
        }
      });
    } 
    else {
      console.warn('🚧 개발 환경 또는 Expo Go 앱에서 실행 중 - 푸시 알림 전송 안함');
    }

    // 알림을 받을 때의 반응을 설정합니다.
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const message = notification.request.content.body || '메시지 내용이 없습니다.';
      const title = notification.request.content.title || '알림';
      
      // 📢 alert로 팝업창 표시
      Alert.alert(
        title, // 알림 제목
        message, // 알림 메시지
        [{ text: '확인', onPress: () => console.log('확인 버튼 클릭됨') }]
      );
    });

    // 구독 해제
    return () => subscription.remove();
  }, []);
}
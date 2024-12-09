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

    const data = await response.json();
    console.log("알림 성공적으로 전송됨:", data);
    return data; // 성공 시 서버의 응답 데이터 반환
  } catch (error) {
    console.error("알림 전송 중 오류 발생:", error);
    throw error; // 에러를 상위 호출자로 전달
  }
};
  
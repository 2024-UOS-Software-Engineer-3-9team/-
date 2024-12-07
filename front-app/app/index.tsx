import React, { useState, useEffect } from "react";
import { View, StyleSheet, Modal } from "react-native";
import SplashScreen from "./SplashScreen";
import LoginScreen from "./LoginScreen";
import SignupScreen from "./SignupScreen";
import ProjectListScreen from "./ProjectListScreen";
import SettingScreen from "./SettingScreen";
import AlarmAllScreen from "./AlarmAllScreen";
import MakeProjectScreen from "./MakeProjectScreen";
import ProjectLobbyScreen from "./ProjectLobbyScreen";
import AlarmTeamScreen from "./AlarmTeamScreen";
import InviteScreen from "./InviteScreen";
import ScheduleLobbyScreen from "./ScheduleLobbyScreen";
// import InsertSchedulePopup from "./InsertSchedulePopup";
import CalenderLobbyScreen from "./CalenderLobbyScreen";
import DaysDetailScreen from "./DaysDetailScreen";
import GenerateTaskScreen from "./GenerateTaskScreen";

export default function Index() {
  const [currentScreen, setCurrentScreen] = useState<
    | "Splash"
    | "Login"
    | "Signup"
    | "ProjectList"
    | "Setting"
    | "AlarmAll"
    | "MakeProject"
    | "ProjectLobby"
    | "AlarmTeam"
    | "Invite"
    | "ScheduleLobby"
    | "CalenderLobby"
    | "DaysDetail"
    | "GenerateTask"
  >("Splash");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null); // 선택된 프로젝트 ID 저장
  const [isPopupVisible, setPopupVisible] = useState(false); // 팝업 표시 상태

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScreen("DaysDetail"); // 2초 후 로그인 화면으로 전환
    }, 2000);
    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case "Splash":
        return <SplashScreen />;
      case "Login":
        return (
          <LoginScreen
            onSignupPress={() => setCurrentScreen("Signup")}
            onLoginPress={() => setCurrentScreen("ProjectList")}
          />
        );
      case "Signup":
        return <SignupScreen onSignupComplete={() => setCurrentScreen("Login")} />;
      case "ProjectList":
        return (
          <ProjectListScreen
            onSettingsPress={() => setCurrentScreen("Setting")}
            onAlarmPress={() => setCurrentScreen("AlarmAll")}
            onAddProjectPress={() => setCurrentScreen("MakeProject")}
            onProjectPress={(projectId) => {
              setSelectedProjectId(projectId); // 선택된 프로젝트 ID 저장
              setCurrentScreen("ProjectLobby");
            }}
          />
        );
      case "Setting":
        return <SettingScreen onBackPress={() => setCurrentScreen("ProjectList")} />;
      case "AlarmAll":
        return <AlarmAllScreen onBackPress={() => setCurrentScreen("ProjectList")} />;
      case "MakeProject":
        return <MakeProjectScreen onBackPress={() => setCurrentScreen("ProjectList")} />;
      case "ProjectLobby":
        return (
          <ProjectLobbyScreen
            projectId={selectedProjectId!} // 선택된 프로젝트 ID 전달
            onBackPress={() => setCurrentScreen("ProjectList")}
            onAlarmPress={() => setCurrentScreen("AlarmTeam")}
            onAddMemberPress={() => setCurrentScreen("Invite")}
            onSchedulePress={() => setCurrentScreen("ScheduleLobby")} // 스케줄 버튼 연결
          />
        );
      case "AlarmTeam":
        return <AlarmTeamScreen onBackPress={() => setCurrentScreen("ProjectLobby")} />;
      case "Invite":
        return <InviteScreen
        projId={selectedProjectId!} // 선택된 프로젝트 ID 전달
        onBackPress={() => setCurrentScreen("ProjectLobby")} />;
      case "ScheduleLobby":
        return (
          <ScheduleLobbyScreen
            onBackPress={() => setCurrentScreen("ProjectLobby")}
            // onOpenPopup={() => setPopupVisible(true)} // 팝업 열기
          />
        );
      case "CalenderLobby":
        return (
          <CalenderLobbyScreen 
          onCalenderPress={() => setCurrentScreen("CalenderLobby")}
          onProjectLobbyPress={() => setCurrentScreen("ProjectLobby")} 
          onSchedulePress={() => setCurrentScreen("ScheduleLobby")}
          onGenerateTaskPress={() => setCurrentScreen("GenerateTask")}
          />
        );
      case "DaysDetail":
        return (
          <DaysDetailScreen 
          onCalenderPress={() => setCurrentScreen("CalenderLobby")}
          onProjectLobbyPress={() => setCurrentScreen("ProjectLobby")} 
          onSchedulePress={() => setCurrentScreen("ScheduleLobby")}
          onGenerateTaskPress={() => setCurrentScreen("GenerateTask")}
          />
        );
      case "GenerateTask":
        return (
          <GenerateTaskScreen
          onCalenderPress={() => setCurrentScreen("CalenderLobby")}
          onProjectLobbyPress={() => setCurrentScreen("ProjectLobby")} 
          onSchedulePress={() => setCurrentScreen("ScheduleLobby")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
      {/* 팝업 모달 */}
      <Modal
        visible={isPopupVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPopupVisible(false)} // 뒤로가기 시 닫기
      >
        {/* <InsertSchedulePopup onClose={() => setPopupVisible(false)} /> */}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage 임포트

interface Project {
  PROJ_ID: string;
  PROJ_NAME: string;
  LEADER_ID: string;
}

interface ProjectListScreenProps {
  onSettingsPress: () => void;
  onAlarmPress: () => void;
  onAddProjectPress: () => void;
  onProjectPress: (projectId: string) => void;
}

const ProjectListScreen: React.FC<ProjectListScreenProps> = ({
  onSettingsPress,
  onAlarmPress,
  onAddProjectPress,
  onProjectPress,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [accessToken, setToken] = useState<string | null>(null); // 토큰 상태

  // AsyncStorage에서 토큰을 가져오는 함수
  const fetchToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("accessToken"); // "token" 키로 저장된 토큰을 가져옴
      if (storedToken) {
        setToken(storedToken); // 가져온 토큰을 상태에 저장
      }
    } catch (error) {
      console.error("토큰을 가져오는 중 오류 발생:", error);
    }
  };

  // 서버에서 프로젝트 목록을 가져오는 함수
  const fetchProjects = async () => {
    if (!accessToken) {
      console.log("토큰이 없습니다.");
      return; // 토큰이 없으면 API 호출을 하지 않음
    }

    setLoading(true);

    try {
      const response = await fetch("http://ec2-43-201-54-81.ap-northeast-2.compute.amazonaws.com:3000/home/my", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`, // 토큰을 Authorization 헤더에 포함
        },
      });

      if (!response.ok) {
        throw new Error("서버 오류");
      }
      
      const data = await response.json();
    
      // 배열을 객체 형태로 변환
      const transformedData = data.map((item: any) => ({
        PROJ_ID: item[0],
        PROJ_NAME: item[1],
        LEADER_ID: item[2],
      }));

      setProjects(transformedData); // 데이터를 상태에 저장
    } catch (error) {
      console.error("프로젝트를 가져오는 중 오류 발생:", error);
    } finally {
      setLoading(false); // 로딩 완료
    }
  };

  useEffect(() => {
    fetchToken(); // 컴포넌트가 마운트될 때 토큰을 가져옴
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchProjects(); // 토큰이 있을 때만 프로젝트 목록을 가져옴
    }
  }, [accessToken]);

  // 로딩 상태에 따른 UI 처리
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Project }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.PROJ_NAME}</Text>
      </View>
      <TouchableOpacity style={styles.cardButton} onPress={() => onProjectPress(item.PROJ_ID)}>
        <Text style={styles.cardButtonText}>바로가기</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>11/16 (토)</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={onAlarmPress} style={styles.iconButton}>
            <Text style={styles.icon}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSettingsPress} style={styles.iconButton}>
            <Text style={styles.icon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 프로젝트 목록 */}
      <FlatList
        data={projects}
        renderItem={renderItem}
        keyExtractor={(item) => item.PROJ_ID}
        contentContainerStyle={styles.list}
      />

      {/* 추가 버튼 */}
      <TouchableOpacity style={styles.floatingButton} onPress={onAddProjectPress}>
        <Text style={styles.floatingButtonText}>+</Text>
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  headerIcons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 10,
  },
  icon: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  list: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  cardButton: {
    backgroundColor: "#0066FF",
    borderRadius: 8,
    marginTop: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  cardButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  floatingButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  floatingButtonText: {
    fontSize: 24,
    color: "#4A90E2",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});

export default ProjectListScreen;
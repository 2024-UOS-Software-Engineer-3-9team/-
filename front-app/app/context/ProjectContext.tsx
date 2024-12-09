import React, { createContext, useState, useContext } from 'react';

type ProjectContextType = {
  userId: string;
  countUser: string | null;
  projectId: string | null;
  leader: string | null;
  date: string | null;
  setUserId: (id: string) => void;
  setCountUser: (id: string) => void;
  setProjectId: (id: string) => void;
  setLeader: (name: string) => void;
  setDate: (date: string) => void;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);  // defaultValue 설정

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string>("");
  const [countUser, setCountUser] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [leader, setLeader] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);

  return (
    <ProjectContext.Provider value={{ userId, setUserId, countUser, setCountUser, projectId, setProjectId, leader, setLeader, date, setDate }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

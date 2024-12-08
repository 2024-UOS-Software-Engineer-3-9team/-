import React, { createContext, useState, useContext } from 'react';

type ProjectContextType = {
  projectId: string | null;
  leader: string | null;
  setProjectId: (id: string) => void;
  setLeader: (name: string) => void;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);  // defaultValue 설정

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [leader, setLeader] = useState<string | null>(null);

  return (
    <ProjectContext.Provider value={{ projectId, setProjectId, leader, setLeader }}>
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

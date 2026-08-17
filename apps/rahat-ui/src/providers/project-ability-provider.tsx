'use client';

import { createMongoAbility, MongoAbility } from '@casl/ability';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { createContext, useContext, useMemo } from 'react';
import { useUserProjectAbilities } from '../hooks/useUserProjectAbilities';

export type ProjectAbilityContextType = {
  ability: MongoAbility;
  isLoading: boolean;
};

export const ProjectAbilityContext =
  createContext<ProjectAbilityContextType | null>(null);

interface ProjectAbilityProviderProps {
  children: React.ReactNode;
}

export function ProjectAbilityProvider({
  children,
}: ProjectAbilityProviderProps) {
  const projectId = useParams().id as UUID;
  const { data, isLoading } = useUserProjectAbilities(projectId);

  const ability = useMemo(
    () => createMongoAbility(data?.data?.rules || []),
    [data],
  );

  return (
    <ProjectAbilityContext.Provider value={{ ability, isLoading }}>
      {children}
    </ProjectAbilityContext.Provider>
  );
}

export const useProjectAbility = (): ProjectAbilityContextType => {
  const context = useContext(ProjectAbilityContext);
  if (!context) {
    throw new Error(
      'useProjectAbility must be used within a ProjectAbilityProvider',
    );
  }
  return context;
};

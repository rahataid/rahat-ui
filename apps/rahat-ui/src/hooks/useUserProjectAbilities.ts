import { useUserStore } from '@rumsan/react-query';
import { useUserAbilitiesInProject } from '@rahat-ui/query';

export type AbilityRule = {
  action: string;
  subject: string;
};

export const useUserProjectAbilities = (projectId: string | null) => {
  const uuid = useUserStore((state) => state.user?.data?.uuid);

  return useUserAbilitiesInProject(uuid, projectId ?? undefined);
};

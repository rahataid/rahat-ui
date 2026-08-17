import { useProjectAbility } from '../providers/project-ability-provider';

export const useCan = (action: string, subject: string) => {
  const { ability, isLoading } = useProjectAbility();
  return { can: ability.can(action, subject), isLoading };
};

type CanProps = {
  action: string;
  subject: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
};

export function Can({
  action,
  subject,
  children,
  fallback = null,
  loadingFallback = null,
}: CanProps) {
  const { can, isLoading } = useCan(action, subject);
  if (isLoading) return <>{loadingFallback}</>;
  return <>{can ? children : fallback}</>;
}

import { useUserStore } from '@rumsan/react-query';
import { useListActiveRoles } from '@rahat-ui/query';
import { AccessDenied } from './accessDenied';

export interface SystemUserAuthProps {
  hasContent?: boolean;
  children: React.ReactNode;
}

export function SystemUserAuth({
  children,
  hasContent = true,
}: SystemUserAuthProps) {
  const uuid = useUserStore((state) => state.user?.data?.uuid);
  const { data, isLoading } = useListActiveRoles(uuid);

  if (isLoading) {
    return null;
  }

  const activeRoles = data?.data;
  const isSystemUser = Array.isArray(activeRoles)
    ? activeRoles.some((activeRole: any) => activeRole?.Role?.isSystem)
    : false;

  if (!isSystemUser) {
    return hasContent ? <AccessDenied /> : null;
  }

  return <>{children}</>;
}

export default SystemUserAuth;

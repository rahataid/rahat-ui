/* eslint-disable-next-line */
import { useTranslations } from 'next-intl';
import { useUserStore } from '@rumsan/react-query';
import { AARoles } from '../enums/aaRoles';
import { AccessDenied } from './accessDenied';

// In the future, if additional projects define their own roles,
// extend CombinedRole as a union of all relevant role enums.
// For now, it only includes AARoles.
// eg : type CombinedRole = AARoles | ABRoles;

type CombinedRole = AARoles;

export interface AuthProps {
  hasContent?: boolean;
  roles?: CombinedRole[];
  children: React.ReactNode;
}

export function RoleAuth({
  children,
  hasContent = true,
  roles = [],
}: AuthProps) {
  const { user } = useUserStore((state) => ({
    user: state.user,
  }));
  const t = useTranslations('GLOBAL');
  const hasRequiredRole =
    roles.length === 0 ||
    roles.some((role) => user?.data?.roles?.includes(role));

  if (!hasRequiredRole) {
    return hasContent ? <AccessDenied /> : null;
  }

  return <>{children}</>;
}

export default RoleAuth;

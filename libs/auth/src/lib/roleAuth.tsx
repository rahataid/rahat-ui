/* eslint-disable-next-line */
import { useRouter } from 'next/navigation';
import { useUserStore } from '@rumsan/react-query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ShieldX } from 'lucide-react';
import { AARoles } from '../enums/aaRoles';

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
  const router = useRouter();
  const hasRequiredRole =
    roles.length === 0 ||
    roles.some((role) => user?.data?.roles?.includes(role));

  if (!hasRequiredRole) {
    return hasContent ? (
      <div className="min-h-screen flex items-center justify-center bg-background/50 backdrop-blur-sm p-4">
        <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-8 border border-border">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <ShieldX className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>

            <h3 className="text-2xl font-bold text-red-600 ">Access Denied</h3>

            <p className="text-muted-foreground">
              You don't have permission to access this page. Please contact your
              administrator for access.
            </p>

            <Button
              onClick={router.back}
              className="bg-gradient-to-r bg-blue-500 hover:bg-blue-600 text-white"
            >
              Return Back
            </Button>
          </div>
        </div>
      </div>
    ) : null;
  }

  return <>{children}</>;
}

export default RoleAuth;

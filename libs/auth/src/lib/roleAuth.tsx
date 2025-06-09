/* eslint-disable-next-line */
import { useRouter } from 'next/navigation';
import { useUserStore } from '@rumsan/react-query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ShieldX } from 'lucide-react';

type Role = 'User' | 'Admin' | 'Manager' | 'Vendor';

export interface AuthProps {
  hasContent?: boolean;
  roles?: Role[];
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

            <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Access Denied
            </h3>

            <p className="text-muted-foreground">
              You don't have permission to access this page. Please contact your
              administrator for access.
            </p>

            <Button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    ) : null;
  }

  return <>{children}</>;
}

export default RoleAuth;

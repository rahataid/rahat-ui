'use client';

import { useListActiveRoles } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useUserStore } from '@rumsan/react-query';
import { UUID } from 'crypto';
import { ShieldX } from 'lucide-react';
import { useRouter } from 'next/navigation';

function hasSystemRole(entry: any): boolean {
  return entry?.Role?.isSystem === true || entry?.isSystem === true;
}

export function useIsSystemUser() {
  const uuid = useUserStore((state) => state.user?.data?.uuid);
  const { data, isLoading, isFetching, isSuccess } = useListActiveRoles(
    uuid as UUID,
  );

  const activeRoles = Array.isArray(data?.data) ? data.data : [];
  const isSystemUser = activeRoles.some(hasSystemRole);

  const isResolving = !uuid || isLoading || isFetching || !isSuccess;

  return { isSystemUser, isLoading: isResolving, activeRoles };
}

export interface SystemUserAuthProps {
  hasContent?: boolean;
  children: React.ReactNode;
}

export function SystemUserAuth({
  children,
  hasContent = true,
}: SystemUserAuthProps) {
  const { isSystemUser, isLoading, activeRoles } = useIsSystemUser();
  const router = useRouter();

  if (isLoading) return null;

  if (!isSystemUser) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[SystemUserAuth] denied. active roles:', activeRoles);
    }

    return hasContent ? (
      <div className="min-h-screen flex items-center justify-center bg-background/50 backdrop-blur-sm p-4">
        <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-8 border border-border">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <ShieldX className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>

            <h3 className="text-2xl font-bold text-red-600 ">Access Denied</h3>

            <p className="text-muted-foreground">
              This page is restricted to system users. Please contact your
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

export default SystemUserAuth;

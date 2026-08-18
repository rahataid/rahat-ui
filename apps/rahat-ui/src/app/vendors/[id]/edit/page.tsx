'use client';

import { useUserStore } from '@rumsan/react-query';
import { VendorsEditView } from 'apps/rahat-ui/src/sections/vendors';
import { isAuthorized } from 'apps/rahat-ui/src/utils';
import { Lock } from 'lucide-react';

const Page = () => {
  const user = useUserStore((state) => state.user);
  const userRoles = user?.data?.roles || [];
  const hasAccess = isAuthorized(userRoles);
  return hasAccess ? (
    <VendorsEditView />
  ) : (
    //TODO: Create a separate component for this and use it in other places as well
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>

        <h2 className="mt-5 text-lg font-semibold tracking-tight">
          Access restricted
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          You don’t have permission to access this page. Contact your
          administrator if you need access.
        </p>
      </div>
    </div>
  );
};

export default Page;

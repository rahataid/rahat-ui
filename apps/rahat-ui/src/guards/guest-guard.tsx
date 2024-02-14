'use client';

import { useAuthStore } from '@rahat-ui/query';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
// routes
import { useCallback, useEffect } from 'react';
import { paths } from '../routes/paths';
//

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const authenticated = useAuthStore((state) => state.isAuthenticated);
  const returnTo = searchParams.get('returnTo');

  // const { isActive } = useWeb3React();

  const check = useCallback(() => {
    if (authenticated) {
      router.replace(returnTo || paths.dashboard.root);
    }
  }, [authenticated, returnTo, router]);

  useEffect(() => {
    check();
  }, [check]);

  return <>{children}</>;
}

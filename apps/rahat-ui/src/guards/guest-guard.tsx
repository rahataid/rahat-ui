'use client';

import { useAuthInitialization } from '@rahat-ui/query';
import { useRouter, useSearchParams } from 'next/navigation';
// routes
import { useCallback, useEffect } from 'react';
import { DEBUG_MODE } from '../constants/config';
import { paths } from '../routes/paths';
//

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [authenticated, initialized] = useAuthInitialization();

  const returnTo = searchParams.get('returnTo');

  // const { isActive } = useWeb3React();

  const check = useCallback(() => {
    if (!DEBUG_MODE && authenticated) {
      router.replace(returnTo || paths.dashboard.root);
    }
  }, [authenticated, returnTo, router]);

  useEffect(() => {
    check();
  }, [check]);

  if (DEBUG_MODE) return <>{children}</>;

  if (!initialized) {
    return 'Loading';
  }

  return <>{children}</>;
}

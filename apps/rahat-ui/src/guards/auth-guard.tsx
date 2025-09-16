'use client';

import { useAuthInitialization } from '@rahat-ui/query';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { DEBUG_MODE } from '../constants/config';
import { paths } from '../routes/paths';
// // routes
// //

// // ----------------------------------------------------------------------

const loginPaths: Record<string, string> = {
  jwt: paths.auth.login,
};

// // ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const [authenticated, initialized] = useAuthInitialization();

  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (!authenticated) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString();

      const loginPath = loginPaths.jwt;

      const href = `${loginPath}?${searchParams}`;

      router.replace(href);
    } else {
      setChecked(true);
    }
  }, [authenticated, router]);

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if (DEBUG_MODE) return <>{children}</>;

  if (!checked) {
    return null;
  }
  if (!initialized) {
    return 'Loading';
  }

  return <>{children}</>;
}

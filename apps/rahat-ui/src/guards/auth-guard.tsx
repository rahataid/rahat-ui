'use client';

import { useAuthStore } from '@rahat-ui/query';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { paths } from '../routes/paths';
// routes
//

// ----------------------------------------------------------------------

const loginPaths: Record<string, string> = {
  jwt: paths.auth.login,
};

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const authenticated = useAuthStore((state) => state.isAuthenticated);
  const initialized = useAuthStore((state) => state.isInitialized);

  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (!authenticated) {
      const searchParams = new URLSearchParams({ returnTo: window.location.pathname }).toString();

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

  if (!checked) {
    return null;
  }
  if (!initialized) {
    return "Loading"
  }

  return <>{children}</>;
}

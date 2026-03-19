'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@rumsan/react-query/auth';
import { toast } from 'react-toastify';
import { paths } from '../../routes/paths';

export default function MagicLinkPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    const accessToken = searchParams.get('access-token');
    const redirectPath = searchParams.get('redirect') || paths.dashboard.root; // Default to dashboard if no redirect is provided

    if (!accessToken) {
      toast.error('Access token is missing.');
      router.push(paths.auth.login);
      return;
    }

    setToken(accessToken);
    router.push(redirectPath); // Redirect to the specified path or default
  }, [searchParams, router, setToken]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white">
      <p className="text-lg text-gray-500">Validating your magic link...</p>
    </div>
  );
}

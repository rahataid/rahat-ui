'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function useActiveTabDynamicKey(queryKey: string, defaultValue: string) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = searchParams.get(queryKey) || defaultValue;

  const setActiveTab = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(queryKey, value);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router, queryKey],
  );

  return {
    activeTab,
    setActiveTab,
  };
}

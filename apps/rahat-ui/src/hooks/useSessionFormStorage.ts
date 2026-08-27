'use client';

import { useCallback, useRef } from 'react';
import { useUserStore } from '@rumsan/react-query';

interface UseSessionFormStorageOptions<T> {
  key: string;
  projectId: string;
  defaultValue: T;
}

export function useSessionFormStorage<T>({
  key,
  projectId,
  defaultValue,
}: UseSessionFormStorageOptions<T>) {
  const userId = useUserStore((state) => state.user?.data?.uuid);
  const storageKeyRef = useRef(
    `form_${projectId}_${key}_${userId || 'anonymous'}`,
  );
  // Update ref when userId loads
  if (userId) {
    storageKeyRef.current = `form_${projectId}_${key}_${userId}`;
  }
  const hasRestored = useRef(false);

  const loadSaved = useCallback((): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const saved = localStorage.getItem(storageKeyRef.current);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load form data:', e);
    }
    return defaultValue;
  }, [defaultValue]);

  const saveData = useCallback(
    (data: T) => {
      if (typeof window === 'undefined') return;
      try {
        localStorage.setItem(storageKeyRef.current, JSON.stringify(data));
      } catch (e) {
        console.error('Failed to save form data:', e);
      }
    },
    [],
  );

  const clearSaved = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(storageKeyRef.current);
  }, []);

  return {
    loadSaved,
    saveData,
    clearSaved,
    hasRestored,
  };
}

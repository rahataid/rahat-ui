'use client';

import { useCallback, useRef, useEffect } from 'react';

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
  const storageKeyRef = useRef(`${key}_${projectId}`);
  const hasRestored = useRef(false);

  // Update storage key when projectId becomes available
  useEffect(() => {
    if (projectId) {
      storageKeyRef.current = `${key}_${projectId}`;
    }
  }, [projectId, key]);

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

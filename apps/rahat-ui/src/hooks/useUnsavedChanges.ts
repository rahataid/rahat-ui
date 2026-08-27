'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface UseUnsavedChangesOptions {
  hasUnsavedChanges: boolean;
  onConfirm?: () => void;
}

export function useUnsavedChanges({
  hasUnsavedChanges,
  onConfirm,
}: UseUnsavedChangesOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const [showDialog, setShowDialog] = useState(false);
  const pendingPath = useRef<string | null>(null);
  const pendingAction = useRef<'push' | 'back' | null>(null);
  const savedRef = useRef(hasUnsavedChanges);
  savedRef.current = hasUnsavedChanges;

  // Keep original methods stable across all renders
  const originalPushRef = useRef(router.push);
  const originalBackRef = useRef(router.back);

  // Scenario 1: Page refresh / close
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Scenario 2: Intercept link clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!savedRef.current) return;

      const target = (e.target as HTMLElement).closest('a[href]');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
      if (href.startsWith('http') && !href.startsWith(window.location.origin)) return;

      e.preventDefault();
      pendingPath.current = href;
      pendingAction.current = 'push';
      setShowDialog(true);
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  // Scenario 3: Intercept router.push and router.back
  useEffect(() => {
    const currentPush = router.push.bind(router);
    const currentBack = router.back.bind(router);

    router.push = (href: string) => {
      if (!savedRef.current) {
        return currentPush(href);
      }
      pendingPath.current = href;
      pendingAction.current = 'push';
      setShowDialog(true);
    };

    router.back = () => {
      if (!savedRef.current) {
        return currentBack();
      }
      pendingAction.current = 'back';
      setShowDialog(true);
    };

    return () => {
      router.push = currentPush;
      router.back = currentBack;
    };
  }, [router]);

  // Scenario 4: Browser back/forward button
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handlePopState = () => {
      pendingAction.current = 'back';
      setShowDialog(true);
      window.history.pushState(null, '', window.location.href);
    };

    window.addEventListener('popstate', handlePopState);
    window.history.pushState(null, '', window.location.href);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsavedChanges]);

  const handleConfirmLeave = useCallback(() => {
    const path = pendingPath.current;
    const action = pendingAction.current;

    // Call onConfirm first (to save data)
    onConfirm?.();

    // Then close dialog and navigate
    setShowDialog(false);
    pendingPath.current = null;
    pendingAction.current = null;

    // Navigate using the original methods
    if (action === 'back') {
      originalBackRef.current();
    } else if (action === 'push' && path) {
      originalPushRef.current(path);
    }
  }, [onConfirm]);

  const handleCancelLeave = useCallback(() => {
    setShowDialog(false);
    pendingPath.current = null;
    pendingAction.current = null;
  }, []);

  return {
    showDialog,
    handleConfirmLeave,
    handleCancelLeave,
    pendingPath: pendingPath.current,
  };
}

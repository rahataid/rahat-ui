'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createContextualCan } from '@casl/react';
import { useUserStore } from '@rumsan/react-query';
import { useProjectStore } from '@rahat-ui/query';
import { AppAbility, buildAbilityFor } from '../types/permissions';
import { usePermissionsStore } from '../store/permissions.store';
import {
  useProjectPermissions,
  useGlobalPermissions,
} from '../hooks/usePermissions';

// Create the context
interface AbilityContextType {
  ability: AppAbility;
  loading: boolean;
  updateAbility: () => void;
}

const AbilityContext = createContext<AbilityContextType | undefined>(undefined);

// Create the Can component for this context - properly typed for CASL
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Can = createContextualCan<AppAbility>(
  AbilityContext.Consumer as any,
);

/**
 * AbilityProvider - Manages CASL abilities with automatic permission fetching
 *
 * Flow:
 * 1. When no project selected: Uses global user permissions (for dashboard)
 * 2. When project selected: Fetches project-specific permissions
 * 3. Caches permissions in Zustand store with 15-minute TTL
 * 4. Auto-refetches in background every 15 minutes
 */
export function AbilityProvider({ children }: { children: React.ReactNode }) {
  const [ability, setAbility] = useState<AppAbility>(() => buildAbilityFor([]));
  const [loading, setLoading] = useState(true);

  console.log('[AbilityProvider] Initializing ability context');
  // Get user from store
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useUserStore((state: any) => state.user);

  console.log('[AbilityProvider] Current user:', user);
  // Get current project from store
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const singleProject = useProjectStore((state: any) => state.singleProject);

  console.log('[AbilityProvider] Current project:', singleProject);
  // Get permissions store - wrap in useCallback to avoid dependency issues
  const setProjectPermissions = usePermissionsStore(
    (state) => state.setProjectPermissions,
  );
  const setGlobalPermissions = usePermissionsStore(
    (state) => state.setGlobalPermissions,
  );
  const getProjectPermissions = usePermissionsStore(
    (state) => state.getProjectPermissions,
  );
  const isProjectPermissionsStale = usePermissionsStore(
    (state) => state.isProjectPermissionsStale,
  );
  const isGlobalPermissionsStale = usePermissionsStore(
    (state) => state.isGlobalPermissionsStale,
  );

  const userId = user?.data?.uuid;
  const projectId = singleProject?.uuid;

  // Fetch project-specific permissions (only when project is selected)
  const {
    data: projectPermissionsData,
    isLoading: projectLoading,
    refetch: refetchProject,
  } = useProjectPermissions(userId, projectId);

  // Fetch global permissions (for dashboard/no project)
  const {
    data: globalPermissionsData,
    isLoading: globalLoading,
    refetch: refetchGlobal,
  } = useGlobalPermissions(userId);

  // Update abilities when permissions change
  useEffect(() => {
    // If project is selected, use project-specific permissions
    if (projectId) {
      // Check if we have cached permissions that are still fresh
      const cachedProjectPerms = getProjectPermissions(projectId);
      const isStale = isProjectPermissionsStale(projectId);

      if (cachedProjectPerms && !isStale) {
        // Use cached permissions
        console.log('[AbilityContext] Using cached project permissions');
        const newAbility = buildAbilityFor(cachedProjectPerms.permissions);
        setAbility(newAbility);
        setLoading(false);
      } else if (projectPermissionsData?.data?.permissions) {
        // Fresh data from API, cache it
        console.log('[AbilityContext] Caching new project permissions');
        setProjectPermissions(
          projectId,
          projectPermissionsData.data.permissions,
        );
        const newAbility = buildAbilityFor(
          projectPermissionsData.data.permissions,
        );
        setAbility(newAbility);
        setLoading(projectLoading);
      } else {
        // Still loading
        setLoading(projectLoading);
      }
    }
    // No project selected, use global permissions
    else {
      const isStale = isGlobalPermissionsStale();
      const cachedGlobalPerms =
        usePermissionsStore.getState().globalPermissions;

      if (cachedGlobalPerms.length > 0 && !isStale) {
        // Use cached global permissions
        console.log('[AbilityContext] Using cached global permissions');
        const newAbility = buildAbilityFor(cachedGlobalPerms);
        setAbility(newAbility);
        setLoading(false);
      } else if (globalPermissionsData?.data?.permissions) {
        // Fresh global data from API
        console.log('[AbilityContext] Caching new global permissions');
        setGlobalPermissions(globalPermissionsData.data.permissions);
        const newAbility = buildAbilityFor(
          globalPermissionsData.data.permissions,
        );
        setAbility(newAbility);
        setLoading(globalLoading);
      } else if (user?.data?.permissions) {
        // Fallback to user permissions from user store
        console.log('[AbilityContext] Using fallback user permissions');
        const newAbility = buildAbilityFor(user.data.permissions);
        setAbility(newAbility);
        setLoading(false);
      } else {
        // Still loading
        setLoading(globalLoading);
      }
    }
  }, [
    projectId,
    projectPermissionsData,
    globalPermissionsData,
    projectLoading,
    globalLoading,
    user,
    getProjectPermissions,
    isProjectPermissionsStale,
    isGlobalPermissionsStale,
    setProjectPermissions,
    setGlobalPermissions,
  ]);

  // Check for stale permissions and refetch if needed
  useEffect(() => {
    if (projectId && userId) {
      const isStale = isProjectPermissionsStale(projectId);
      if (isStale) {
        console.log(
          '[AbilityContext] Project permissions are stale, refetching...',
        );
        refetchProject();
      }
    } else if (userId) {
      const isStale = isGlobalPermissionsStale();
      if (isStale) {
        console.log(
          '[AbilityContext] Global permissions are stale, refetching...',
        );
        refetchGlobal();
      }
    }
  }, [
    projectId,
    userId,
    isProjectPermissionsStale,
    isGlobalPermissionsStale,
    refetchProject,
    refetchGlobal,
  ]);

  // Function to manually trigger permission refresh
  const updateAbility = () => {
    console.log('[AbilityContext] Manual refresh triggered');
    if (projectId) {
      refetchProject();
    } else {
      refetchGlobal();
    }
  };

  return (
    <AbilityContext.Provider value={{ ability, loading, updateAbility }}>
      {children}
    </AbilityContext.Provider>
  );
}

/**
 * Hook to access the CASL ability instance
 * Use this to check permissions programmatically
 *
 * @example
 * const ability = useAbility();
 * const canCreate = ability.can('create', 'FundManagement');
 */
export function useAbility() {
  const context = useContext(AbilityContext);
  if (!context) {
    throw new Error('useAbility must be used within AbilityProvider');
  }
  return context.ability;
}

/**
 * Hook to access the full ability context (including loading state)
 */
export function useAbilityContext() {
  const context = useContext(AbilityContext);
  if (!context) {
    throw new Error('useAbilityContext must be used within AbilityProvider');
  }
  return context;
}

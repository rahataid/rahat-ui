'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createContextualCan } from '@casl/react';
import { useUserStore } from '@rumsan/react-query';
import { useProjectStore } from '@rahat-ui/query';
import { AppAbility, buildAbilityFor, Permission } from '../types/permissions';
import { usePermissionsStore } from '../store/permissions.store';
import {
  useProjectPermissions,
  useGlobalPermissions,
} from '../hooks/usePermissions';
import { logger } from '../utils/logger';

// ============================================================================
// TYPES
// ============================================================================

interface AbilityContextType {
  ability: AppAbility;
  loading: boolean;
  updateAbility: () => void;
}

interface PermissionsData {
  data: {
    permissions: Permission[];
  };
}

// ============================================================================
// CONTEXT
// ============================================================================

const AbilityContext = createContext<AbilityContextType | undefined>(undefined);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Can = createContextualCan<AppAbility>(
  AbilityContext.Consumer as any,
);

// ============================================================================
// HELPER FUNCTIONS (Extracted for Clean Code)
// ============================================================================

/**
 * Build ability from cached permissions if fresh, otherwise return null
 */
function buildAbilityFromCache(
  projectId: string | undefined,
  getProjectPermissions: (id: string) => any,
  isProjectPermissionsStale: (id: string) => boolean,
  globalPermissions: Permission[],
  isGlobalPermissionsStale: () => boolean,
): AppAbility | null {
  if (projectId) {
    const cached = getProjectPermissions(projectId);
    const isStale = isProjectPermissionsStale(projectId);

    if (cached && !isStale) {
      logger.debug('Using cached project permissions');
      return buildAbilityFor(cached.permissions);
    }
  } else {
    const isStale = isGlobalPermissionsStale();

    if (globalPermissions.length > 0 && !isStale) {
      logger.debug('Using cached global permissions');
      return buildAbilityFor(globalPermissions);
    }
  }

  return null;
}

/**
 * Build ability from fresh API data and cache it
 */
function buildAbilityFromFreshData(
  projectId: string | undefined,
  projectData: PermissionsData | undefined,
  globalData: PermissionsData | undefined,
  setProjectPermissions: (id: string, permissions: Permission[]) => void,
  setGlobalPermissions: (permissions: Permission[]) => void,
): AppAbility | null {
  if (projectId && projectData?.data?.permissions) {
    logger.debug('Caching new project permissions');
    setProjectPermissions(projectId, projectData.data.permissions);
    return buildAbilityFor(projectData.data.permissions);
  }

  if (!projectId && globalData?.data?.permissions) {
    logger.debug('Caching new global permissions');
    setGlobalPermissions(globalData.data.permissions);
    return buildAbilityFor(globalData.data.permissions);
  }

  return null;
}

/**
 * Fallback to user permissions if no other data available
 */
function buildAbilityFromUserFallback(
  projectId: string | undefined,
  user: any,
): AppAbility | null {
  if (!projectId && user?.data?.permissions) {
    logger.debug('Using fallback user permissions');
    return buildAbilityFor(user.data.permissions);
  }

  return null;
}

// ============================================================================
// CUSTOM HOOK: Separated Permission Sync Logic
// ============================================================================

function usePermissionSync(
  projectId: string | undefined,
  userId: string | undefined,
  isProjectPermissionsStale: (id: string) => boolean,
  isGlobalPermissionsStale: () => boolean,
  refetchProject: () => void,
  refetchGlobal: () => void,
) {
  useEffect(() => {
    if (!userId) return;

    if (projectId) {
      const isStale = isProjectPermissionsStale(projectId);
      if (isStale) {
        logger.debug('Project permissions are stale, refetching...');
        refetchProject();
      }
    } else {
      const isStale = isGlobalPermissionsStale();
      if (isStale) {
        logger.debug('Global permissions are stale, refetching...');
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
}

// ============================================================================
// PROVIDER COMPONENT (Now Much Cleaner!)
// ============================================================================

export function AbilityProvider({ children }: { children: React.ReactNode }) {
  const [ability, setAbility] = useState<AppAbility>(() => buildAbilityFor([]));
  const [loading, setLoading] = useState(true);

  // Store selectors (extracted to top level)
  const {
    setProjectPermissions,
    setGlobalPermissions,
    getProjectPermissions,
    isProjectPermissionsStale,
    isGlobalPermissionsStale,
    globalPermissions,
  } = usePermissionsStore();

  // User and project data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useUserStore((state: any) => state.user);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const singleProject = useProjectStore((state: any) => state.singleProject);

  const userId = user?.data?.uuid;
  const projectId = singleProject?.uuid;

  // Fetch permissions
  const {
    data: projectPermissionsData,
    isLoading: projectLoading,
    refetch: refetchProject,
  } = useProjectPermissions(userId, projectId);

  const {
    data: globalPermissionsData,
    isLoading: globalLoading,
    refetch: refetchGlobal,
  } = useGlobalPermissions(userId);

  // Main permission sync logic (now much simpler!)
  useEffect(() => {
    // Try cache first
    const cachedAbility = buildAbilityFromCache(
      projectId,
      getProjectPermissions,
      isProjectPermissionsStale,
      globalPermissions,
      isGlobalPermissionsStale,
    );

    if (cachedAbility) {
      setAbility(cachedAbility);
      setLoading(false);
      return;
    }

    // Try fresh data
    const freshAbility = buildAbilityFromFreshData(
      projectId,
      projectPermissionsData,
      globalPermissionsData,
      setProjectPermissions,
      setGlobalPermissions,
    );

    if (freshAbility) {
      setAbility(freshAbility);
      setLoading(projectId ? projectLoading : globalLoading);
      return;
    }

    // Fallback to user permissions
    const fallbackAbility = buildAbilityFromUserFallback(projectId, user);

    if (fallbackAbility) {
      setAbility(fallbackAbility);
      setLoading(false);
      return;
    }

    // Still loading
    setLoading(projectId ? projectLoading : globalLoading);
  }, [
    projectId,
    projectPermissionsData,
    globalPermissionsData,
    projectLoading,
    globalLoading,
    user,
    // Store functions are stable, but include them for clarity
    getProjectPermissions,
    isProjectPermissionsStale,
    isGlobalPermissionsStale,
    setProjectPermissions,
    setGlobalPermissions,
    globalPermissions,
  ]);

  // Stale check logic (extracted to custom hook)
  usePermissionSync(
    projectId,
    userId,
    isProjectPermissionsStale,
    isGlobalPermissionsStale,
    refetchProject,
    refetchGlobal,
  );

  // Manual refresh
  const updateAbility = () => {
    logger.debug('Manual refresh triggered');
    projectId ? refetchProject() : refetchGlobal();
  };

  return (
    <AbilityContext.Provider value={{ ability, loading, updateAbility }}>
      {children}
    </AbilityContext.Provider>
  );
}

// ============================================================================
// HOOKS
// ============================================================================

export function useAbility() {
  const context = useContext(AbilityContext);
  if (!context) {
    throw new Error('useAbility must be used within AbilityProvider');
  }
  return context.ability;
}

export function useAbilityContext() {
  const context = useContext(AbilityContext);
  if (!context) {
    throw new Error('useAbilityContext must be used within AbilityProvider');
  }
  return context;
}

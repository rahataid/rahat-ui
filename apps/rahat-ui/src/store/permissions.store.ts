import { create } from 'zustand';
import { Permission } from '../types/permissions';

// TTL duration: 15 minutes in milliseconds
const PERMISSIONS_TTL = 15 * 60 * 1000;

interface ProjectPermissions {
  permissions: Permission[];
  fetchedAt: number; // timestamp
  isLoading: boolean;
}

interface PermissionsState {
  // Map of projectId -> permissions
  projectPermissions: Record<string, ProjectPermissions>;

  // Global user permissions (for dashboard when no project selected)
  globalPermissions: Permission[];
  globalFetchedAt: number;
  globalLoading: boolean;

  // Actions
  setProjectPermissions: (projectId: string, permissions: Permission[]) => void;
  setGlobalPermissions: (permissions: Permission[]) => void;
  setProjectLoading: (projectId: string, isLoading: boolean) => void;
  setGlobalLoading: (isLoading: boolean) => void;
  getProjectPermissions: (projectId: string) => ProjectPermissions | null;
  isProjectPermissionsStale: (projectId: string) => boolean;
  isGlobalPermissionsStale: () => boolean;
  clearProjectPermissions: (projectId: string) => void;
  clearAllPermissions: () => void;
}

export const usePermissionsStore = create<PermissionsState>((set, get) => ({
  projectPermissions: {},
  globalPermissions: [],
  globalFetchedAt: 0,
  globalLoading: false,

  setProjectPermissions: (projectId: string, permissions: Permission[]) => {
    set((state) => ({
      projectPermissions: {
        ...state.projectPermissions,
        [projectId]: {
          permissions,
          fetchedAt: Date.now(),
          isLoading: false,
        },
      },
    }));
  },

  setGlobalPermissions: (permissions: Permission[]) => {
    set({
      globalPermissions: permissions,
      globalFetchedAt: Date.now(),
      globalLoading: false,
    });
  },

  setProjectLoading: (projectId: string, isLoading: boolean) => {
    set((state) => ({
      projectPermissions: {
        ...state.projectPermissions,
        [projectId]: {
          ...state.projectPermissions[projectId],
          permissions: state.projectPermissions[projectId]?.permissions || [],
          fetchedAt: state.projectPermissions[projectId]?.fetchedAt || 0,
          isLoading,
        },
      },
    }));
  },

  setGlobalLoading: (isLoading: boolean) => {
    set({ globalLoading: isLoading });
  },

  getProjectPermissions: (projectId: string) => {
    const state = get();
    return state.projectPermissions[projectId] || null;
  },

  isProjectPermissionsStale: (projectId: string) => {
    const state = get();
    const projectPerms = state.projectPermissions[projectId];

    if (!projectPerms) return true; // No data, need to fetch

    const now = Date.now();
    const age = now - projectPerms.fetchedAt;

    return age > PERMISSIONS_TTL; // Stale if older than 15 minutes
  },

  isGlobalPermissionsStale: () => {
    const state = get();

    if (!state.globalFetchedAt) return true; // No data, need to fetch

    const now = Date.now();
    const age = now - state.globalFetchedAt;

    return age > PERMISSIONS_TTL; // Stale if older than 15 minutes
  },

  clearProjectPermissions: (projectId: string) => {
    set((state) => {
      const newProjectPermissions = { ...state.projectPermissions };
      delete newProjectPermissions[projectId];
      return { projectPermissions: newProjectPermissions };
    });
  },

  clearAllPermissions: () => {
    set({
      projectPermissions: {},
      globalPermissions: [],
      globalFetchedAt: 0,
      globalLoading: false,
    });
  },
}));

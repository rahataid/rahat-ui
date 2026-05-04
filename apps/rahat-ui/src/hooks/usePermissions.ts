import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Permission } from '../types/permissions';
import {
  fetchProjectPermissions,
  fetchGlobalPermissions,
} from '../services/permissions.mock';

interface PermissionsResponse {
  data: {
    permissions: Permission[];
  };
}

/**
 * Hook to fetch project-specific permissions for a user
 * Auto-refetches every 15 minutes (900000ms)
 */
export function useProjectPermissions(
  userId: string | undefined,
  projectId: string | undefined,
): UseQueryResult<PermissionsResponse, Error> {
  return useQuery({
    queryKey: ['permissions', 'project', userId, projectId],
    queryFn: () => {
      if (!userId || !projectId) {
        throw new Error('userId and projectId are required');
      }
      return fetchProjectPermissions(userId, projectId);
    },
    enabled: !!userId && !!projectId, // Only run if both exist
    staleTime: 15 * 60 * 1000, // 15 minutes - consider data fresh for this long
    refetchInterval: 15 * 60 * 1000, // Auto-refetch every 15 minutes in background
    refetchOnWindowFocus: false, // Don't refetch on window focus (optional)
    retry: 2, // Retry failed requests twice
  });
}

/**
 * Hook to fetch global user permissions (for dashboard/no project selected)
 * Auto-refetches every 15 minutes (900000ms)
 */
export function useGlobalPermissions(
  userId: string | undefined,
): UseQueryResult<PermissionsResponse, Error> {
  return useQuery({
    queryKey: ['permissions', 'global', userId],
    queryFn: () => {
      if (!userId) {
        throw new Error('userId is required');
      }
      return fetchGlobalPermissions(userId);
    },
    enabled: !!userId, // Only run if userId exists
    staleTime: 15 * 60 * 1000, // 15 minutes
    refetchInterval: 15 * 60 * 1000, // Auto-refetch every 15 minutes in background
    refetchOnWindowFocus: false,
    retry: 2,
  });
}

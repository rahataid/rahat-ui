import { UseQueryResult } from '@tanstack/react-query';
import { Permission } from '../types/permissions';
import {
  useProjectPermissions as useProjectPermissionsQuery,
  useGlobalPermissions as useGlobalPermissionsQuery,
} from '@rahat-ui/query';

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
  return useProjectPermissionsQuery(userId, projectId);
}

/**
 * Hook to fetch global user permissions (for dashboard/no project selected)
 * Auto-refetches every 15 minutes (900000ms)
 */
export function useGlobalPermissions(
  userId: string | undefined,
): UseQueryResult<PermissionsResponse, Error> {
  return useGlobalPermissionsQuery(userId);
}

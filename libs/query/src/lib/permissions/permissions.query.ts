'use client';
import { useRSQuery, useUserStore } from '@rumsan/react-query';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { TAGS } from '../../config';

/**
 * Permission interface matching backend response
 */
export interface Permission {
  action: string;
  subject: string;
  inverted: boolean;
  conditions?: unknown;
}

/**
 * API response structure matching the expected format
 */
interface PermissionsResponse {
  data: {
    permissions: Permission[];
  };
}

/**
 * Hook to fetch project-specific permissions for a user
 * Endpoint: GET /v1/users/{userId}/xrefId/{projectId}/permissions
 */
export const useProjectPermissions = (
  userId: string | undefined,
  projectId: string | undefined,
): UseQueryResult<PermissionsResponse, Error> => {
  const { rumsanService, queryClient } = useRSQuery();

  return useQuery(
    {
      queryKey: [TAGS.GET_PROJECT_PERMISSIONS, userId, projectId],
      queryFn: async () => {
        if (!userId || !projectId) {
          throw new Error('userId and projectId are required');
        }

        const response = await rumsanService.client.get<{
          success: boolean;
          data: Array<{
            id: number;
            roleId: number;
            action: string;
            subject: string;
            inverted: boolean;
            conditions: unknown;
            reason: string | null;
            createdAt: string;
            updatedAt: string;
          }>;
        }>(`/users/${userId}/xrefId/${projectId}/permissions`);

        // Map the response to the Permission format
        const permissions: Permission[] = response.data.data.map((item) => ({
          action: item.action,
          subject: item.subject,
          inverted: item.inverted,
          conditions: item.conditions || undefined,
        }));

        // console.log(
        //   `[API] ✅ Fetched ${permissions.length} permissions for user ${userId} in project ${projectId}`,
        //   permissions,
        // );

        return {
          data: {
            permissions,
          },
        };
      },
      enabled: !!userId && !!projectId,
      staleTime: 15 * 60 * 1000, // 15 minutes
      refetchInterval: 15 * 60 * 1000, // Auto-refetch every 15 minutes
      refetchOnWindowFocus: false,
      retry: 2,
    },
    queryClient,
  );
};

/**
 * Hook to fetch global user permissions (for dashboard/no project selected)
 * Reads permissions from the user store (already fetched by useUserCurrentUser)
 */
export const useGlobalPermissions = (
  userId: string | undefined,
): UseQueryResult<PermissionsResponse, Error> => {
  const { queryClient } = useRSQuery();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useUserStore((state: any) => state.user);

  return useQuery(
    {
      queryKey: [TAGS.GET_GLOBAL_PERMISSIONS, userId],
      queryFn: async () => {
        if (!userId) {
          throw new Error('userId is required');
        }

        // Read permissions from user store (already fetched by useUserCurrentUser)
        const permissions: Permission[] = user?.data?.permissions || [];

        // console.log(
        //   `[API] ✅ Using ${permissions.length} global permissions from user store for user ${userId}`,
        //   permissions,
        // );

        return {
          data: {
            permissions,
          },
        };
      },
      enabled: !!userId && !!user?.data?.permissions,
      staleTime: 15 * 60 * 1000, // 15 minutes
      refetchInterval: 15 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 2,
    },
    queryClient,
  );
};

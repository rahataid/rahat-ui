'use client';
import { useRSQuery } from '@rumsan/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useCallback, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useProjectAction } from '../projects';
import { GetGrievanceList, GrievanceFormData } from './types/grievance';
import { UUID } from 'crypto';
import { useSwal } from '../../swal';

const MS_ACTIONS = {
  GRIEVANCES: {
    LIST_BY_PROJECT: 'aa.grievances.list',
    ADD: 'aa.grievances.create',
    GET: 'aa.grievances.get',
    UPDATE: 'aa.grievances.update',
    UPDATE_STATUS: 'aa.grievances.updateStatus',
    GET_OVERVIEW_STATS: 'aa.grievances.getOverviewStats',
  },
};

export const useGrievanceList = (payload: GetGrievanceList) => {
  const q = useProjectAction<any[]>();
  const { projectUUID, ...restPayload } = payload;
  const { queryClient } = useRSQuery();

  // Debounce function with proper TypeScript types
  const debounce = useCallback(<T>(fn: (args: T) => void, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (args: T) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(args), delay);
    };
  }, []);

  // Debounced payload string to prevent rapid updates
  const [debouncedPayload, setDebouncedPayload] = useState<string>('');

  // Memoize the debounced function to prevent recreation on every render
  const debouncedSetPayload = useMemo(
    () =>
      debounce<Record<string, unknown>>((payload) => {
        setDebouncedPayload(JSON.stringify(payload));
      }, 300),
    [debounce],
  );

  // Update debounced payload when restPayload changes
  useEffect(() => {
    debouncedSetPayload(restPayload);
  }, [restPayload, debouncedSetPayload]);

  const query = useQuery(
    {
      queryKey: [MS_ACTIONS.GRIEVANCES.LIST_BY_PROJECT, projectUUID, debouncedPayload],
      enabled: !!debouncedPayload, // Only run query when we have a debounced payload
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      staleTime: 15 * 60 * 1000, // 15 minutes
      queryFn: async () => {
        return q.mutateAsync({
          uuid: projectUUID,
          data: {
            action: MS_ACTIONS.GRIEVANCES.LIST_BY_PROJECT,
            payload: restPayload,
          },
        });
      },
    },
    queryClient,
  );

  return {
    ...query,
    data: useMemo(() => {
      return {
        ...query.data,
        data: query.data?.data?.length
          ? query.data.data.map((row: any) => ({
              ...row,
              uuid: row?.uuid?.toString(),
              walletAddress: row?.walletAddress?.toString(),
              voucherClaimStatus: row?.claimStatus,
              name: row?.piiData?.name || '',
              email: row?.piiData?.email || '',
              gender: row?.projectData?.gender?.toString() || '',
              phone: row?.piiData?.phone || 'N/A',
              type: row?.type?.toString() || 'N/A',
              phoneStatus: row?.projectData?.phoneStatus || '',
              bankedStatus: row?.projectData?.bankedStatus || '',
              internetStatus: row?.projectData?.internetStatus || '',
              benTokens: row?.benTokens || 'N/A',
            }))
          : [],
      };
    }, [query.data]),
  };
};

export const useGrievanceAdd = () => {
  const t = useTranslations('AA_PROJECT');
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  const q = useProjectAction<GrievanceFormData>();
  const { queryClient } = useRSQuery();

  const query = useMutation(
    {
      mutationFn: async ({
        projectUUID,
        grievancePayload,
      }: {
        projectUUID: UUID;
        grievancePayload: GrievanceFormData;
      }) => {
        return q.mutateAsync({
          uuid: projectUUID,
          data: {
            action: MS_ACTIONS.GRIEVANCES.ADD,
            payload: grievancePayload,
          },
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [MS_ACTIONS.GRIEVANCES.LIST_BY_PROJECT],
        });
        queryClient.invalidateQueries({
          queryKey: [MS_ACTIONS.GRIEVANCES.GET_OVERVIEW_STATS],
        });
        queryClient.invalidateQueries({
          queryKey: [MS_ACTIONS.GRIEVANCES.LIST_BY_PROJECT, 'download'],
        });
        queryClient.refetchQueries({
          queryKey: [MS_ACTIONS.GRIEVANCES.LIST_BY_PROJECT, 'download'],
        });
        console.log('Download cache invalidated and refetched after add');
        toast.fire({
          title: t('GRIEVANCE_ADDED_SUCCESSFULLY'),
          icon: 'success',
        });
      },
      onError: (error: any) => {
        console.log('error', error);
        const errorMessage = error?.response?.data?.message || t('ERROR');
        toast.fire({
          title: t('ERROR_WHILE_ADDING_GRIEVANCE'),
          icon: 'error',
          text: errorMessage,
        });
      },
    },
    queryClient,
  );

  return query;
};

export const useGrievanceDetails = ({
  projectUUID,
  grievanceUUID,
}: {
  projectUUID: UUID;
  grievanceUUID: UUID;
}) => {
  const q = useProjectAction<GrievanceFormData>();
  const { queryClient } = useRSQuery();

  const query = useQuery(
    {
      queryKey: [MS_ACTIONS.GRIEVANCES.GET, grievanceUUID],
      queryFn: async () => {
        return q.mutateAsync({
          uuid: projectUUID,
          data: {
            action: MS_ACTIONS.GRIEVANCES.GET,
            payload: { uuid: grievanceUUID },
          },
        });
      },
    },
    queryClient,
  );

  return query;
};

export const useGrievanceEdit = () => {
  const t = useTranslations('AA_PROJECT');
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  const q = useProjectAction<GrievanceFormData & { uuid: string }>();
  const { queryClient } = useRSQuery();

  const query = useMutation(
    {
      mutationFn: async ({
        projectUUID,
        grievancePayload,
      }: {
        projectUUID: UUID;
        grievancePayload: GrievanceFormData & { uuid: string };
      }) => {
        return q.mutateAsync({
          uuid: projectUUID,
          data: {
            action: MS_ACTIONS.GRIEVANCES.UPDATE,
            payload: grievancePayload,
          },
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [MS_ACTIONS.GRIEVANCES.LIST_BY_PROJECT],
        });
        queryClient.invalidateQueries({
          queryKey: [MS_ACTIONS.GRIEVANCES.GET_OVERVIEW_STATS],
        });
        queryClient.invalidateQueries({
          queryKey: [MS_ACTIONS.GRIEVANCES.LIST_BY_PROJECT, 'download'],
        });
        queryClient.refetchQueries({
          queryKey: [MS_ACTIONS.GRIEVANCES.LIST_BY_PROJECT, 'download'],
        });
        toast.fire({
          title: t('GRIEVANCE_UPDATED_SUCCESSFULLY'),
          icon: 'success',
        });
      },
      onError: (error: any) => {
        console.log('error', error);
        const errorMessage = error?.response?.data?.message || t('ERROR');
        toast.fire({
          title: t('ERROR_WHILE_UPDATING_GRIEVANCE'),
          icon: 'error',
          text: errorMessage,
        });
      },
    },
    queryClient,
  );

  return query;
};

export const useGrievanceEditStatus = () => {
  const t = useTranslations('AA_PROJECT');
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  const q = useProjectAction<{ uuid: string; status: string }>();
  const { queryClient } = useRSQuery();

  const query = useMutation(
    {
      mutationFn: async ({
        projectUUID,
        grievancePayload,
      }: {
        projectUUID: UUID;
        grievancePayload: { uuid: string; status: string };
      }) => {
        return q.mutateAsync({
          uuid: projectUUID,
          data: {
            action: MS_ACTIONS.GRIEVANCES.UPDATE_STATUS,
            payload: grievancePayload,
          },
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [MS_ACTIONS.GRIEVANCES.LIST_BY_PROJECT],
        });
        queryClient.invalidateQueries({
          queryKey: [MS_ACTIONS.GRIEVANCES.GET_OVERVIEW_STATS],
        });
        queryClient.invalidateQueries({
          queryKey: [MS_ACTIONS.GRIEVANCES.LIST_BY_PROJECT, 'download'],
        });
        queryClient.refetchQueries({
          queryKey: [MS_ACTIONS.GRIEVANCES.LIST_BY_PROJECT, 'download'],
        });
        toast.fire({
          title: t('GRIEVANCE_STATUS_UPDATED_SUCCESSFULLY'),
          icon: 'success',
        });
      },
      onError: (error: any) => {
        console.log('error', error);
        const errorMessage = error?.response?.data?.message || t('ERROR');
        toast.fire({
          title: t('ERROR_WHILE_UPDATING_GRIEVANCE_STATUS'),
          icon: 'error',
          text: errorMessage,
        });
      },
    },
    queryClient,
  );

  return query;
};

export const useGrievanceListForDownload = (projectUUID: UUID) => {
  const q = useProjectAction<any[]>();
  const { queryClient } = useRSQuery();

  const query = useQuery(
    {
      queryKey: [
        MS_ACTIONS.GRIEVANCES.LIST_BY_PROJECT,
        'download',
        projectUUID,
      ],
      queryFn: async () => {
        return q.mutateAsync({
          uuid: projectUUID,
          data: {
            action: MS_ACTIONS.GRIEVANCES.LIST_BY_PROJECT,
            payload: {
              page: 1,
              perPage: 10000, // Fetch all data at once
              order: 'desc',
              sort: 'createdAt',
            },
          },
        });
      },
      enabled: !!projectUUID,
      staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes
      gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
      refetchOnMount: false, // Don't refetch on mount if data is fresh
      refetchOnWindowFocus: false, // Don't refetch on window focus
    },
    queryClient,
  );

  return {
    ...query,
    data: useMemo(() => {
      return {
        ...query.data,
        data: query.data?.data?.length
          ? query.data.data.map((row: any) => ({
              ...row,
              uuid: row?.uuid?.toString(),
              walletAddress: row?.walletAddress?.toString(),
              voucherClaimStatus: row?.claimStatus,
              name: row?.piiData?.name || '',
              email: row?.piiData?.email || '',
              gender: row?.projectData?.gender?.toString() || '',
              phone: row?.piiData?.phone || 'N/A',
              type: row?.type?.toString() || 'N/A',
              phoneStatus: row?.projectData?.phoneStatus || '',
              bankedStatus: row?.projectData?.bankedStatus || '',
              internetStatus: row?.projectData?.internetStatus || '',
              benTokens: row?.benTokens || 'N/A',
            }))
          : [],
      };
    }, [query.data]),
  };
};

export const useGetOverviewStats = (projectUUID: UUID) => {
  const t = useTranslations('AA_PROJECT');
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  const q = useProjectAction<{
    totalGrievances: number;
    grievanceType: {
      TECHNICAL: number;
      NON_TECHNICAL: number;
      OTHER: number;
    };
    grievanceStatus: {
      NEW: number;
      UNDER_REVIEW: number;
      RESOLVED: number;
      CLOSED: number;
    };
    averageResolveTime: number;
  }>();

  const query = useQuery({
    queryKey: [MS_ACTIONS.GRIEVANCES.GET_OVERVIEW_STATS, projectUUID],
    queryFn: async () => {
      try {
        return await q.mutateAsync({
          uuid: projectUUID,
          data: {
            action: MS_ACTIONS.GRIEVANCES.GET_OVERVIEW_STATS,
            payload: {},
          },
        });
      } catch (error: any) {
        console.log('error', error);
        const errorMessage = error?.response?.data?.message || t('ERROR');
        toast.fire({
          title: t('ERROR_WHILE_FETCHING_OVERVIEW_STATS'),
          icon: 'error',
          text: errorMessage,
        });
        throw error;
      }
    },
    enabled: !!projectUUID, // Only run query if projectUUID exists
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  return query;
};

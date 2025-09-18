'use client';
import { useQuery, useRSQuery } from '@rumsan/react-query';
import { useMutation } from '@tanstack/react-query';
import { useMemo, useCallback, useState, useEffect } from 'react';
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
      queryKey: [MS_ACTIONS.GRIEVANCES.LIST_BY_PROJECT, debouncedPayload],
      enabled: !!debouncedPayload, // Only run query when we have a debounced payload
      refetchOnMount: true,
      refetchOnWindowFocus: true,
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
        toast.fire({
          title: 'Grievance added successfully.',
          icon: 'success',
        });
      },
      onError: (error: any) => {
        console.log('error', error);
        const errorMessage = error?.response?.data?.message || 'Error';
        toast.fire({
          title: 'Error while adding grievance.',
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
        toast.fire({
          title: 'Grievance updated successfully.',
          icon: 'success',
        });
      },
      onError: (error: any) => {
        console.log('error', error);
        const errorMessage = error?.response?.data?.message || 'Error';
        toast.fire({
          title: 'Error while updating grievance.',
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
        toast.fire({
          title: 'Grievance status updated successfully.',
          icon: 'success',
        });
      },
      onError: (error: any) => {
        console.log('error', error);
        const errorMessage = error?.response?.data?.message || 'Error';
        toast.fire({
          title: 'Error while updating grievance status.',
          icon: 'error',
          text: errorMessage,
        });
      },
    },
    queryClient,
  );

  return query;
};

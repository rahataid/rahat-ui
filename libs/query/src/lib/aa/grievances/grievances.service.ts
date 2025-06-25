import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useProjectAction } from '../../projects';
import { useEffect } from 'react';
import { useAAGrievancesStore } from './store';
import { toast } from 'sonner';

export const useGrievancesList = (payload: any) => {
  const { setGrievances } = useAAGrievancesStore((state) => ({
    setGrievances: state.setGrievances,
  }));
  const q = useProjectAction<any[]>();
  const { projectUUID, ...restPayload } = payload;

  const restPayloadString = JSON.stringify(restPayload);

  const query = useQuery({
    queryKey: ['grievances', restPayloadString],
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.grievances.list',
          payload: restPayload,
        },
      });
      return mutate;
    },
  });
  useEffect(() => {
    if (query?.data) {
      setGrievances(query?.data?.data);
    }
  }, [query?.data?.data]);
  return query;
};

export const useChangeGrievanceStatus = () => {
  const queryClient = useQueryClient();
  const q = useProjectAction<any>();

  return useMutation({
    mutationFn: async (payload: {
      projectUUID: string;
      grievanceId: string;
      status: string;
    }) => {
      const { projectUUID, ...rest } = payload;
      const response = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.grievances.changeStatus',
          payload: rest,
        },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grievances'] });
      toast.success('Grievance status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update grievance status');
    },
  });
};

export const useUpdateGrievance = () => {
  const queryClient = useQueryClient();
  const q = useProjectAction<any>();

  return useMutation({
    mutationFn: async (payload: {
      projectUUID: string;
      grievanceId: string;
      data: any;
    }) => {
      const { projectUUID, ...rest } = payload;
      const response = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.grievances.update',
          payload: rest,
        },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grievances'] });
      toast.success('Grievance updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update grievance');
    },
  });
};

export const useGrievanceDetails = (
  projectUUID: string,
  grievanceUUID: string,
) => {
  const q = useProjectAction<any>();

  return useQuery({
    queryKey: ['grievances.details', grievanceUUID],
    queryFn: async () => {
      const response = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.grievances.get',
          payload: { grievanceUUID },
        },
      });
      return response?.data;
    },
    enabled: !!grievanceUUID && !!projectUUID,
  });
};

export const useRemoveGrievance = () => {
  const queryClient = useQueryClient();
  const q = useProjectAction<any>();

  return useMutation({
    mutationFn: async (payload: {
      projectUUID: string;
      grievanceUUID: string;
    }) => {
      const response = await q.mutateAsync({
        uuid: payload.projectUUID,
        data: {
          action: 'aa.grievances.remove',
          payload: { uuid: payload.grievanceUUID },
        },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grievances'] });
      toast.success('Grievance removed successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove grievance');
    },
  });
};

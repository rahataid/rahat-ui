import { useEffect } from 'react';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useProjectAction } from '../../projects';
import { useStakeholdersGroupsStore } from './groups.store';
import { UUID } from 'crypto';
import { useSwal } from 'libs/query/src/swal';

export const useCreateStakeholdersGroups = () => {
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({
      projectUUID,
      stakeholdersGroupPayload,
    }: {
      projectUUID: UUID;
      stakeholdersGroupPayload: {
        name: string;
        stakeholders: Array<{
          uuid: string;
        }>;
      };
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aaProject.stakeholders.addGroup',
          payload: stakeholdersGroupPayload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      toast.fire({
        title: 'Stakeholders Group added successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while adding stakeholders group.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useStakeholdersGroups = (uuid: UUID, payload: any) => {
  const q = useProjectAction();
  const { setStakeholdersGroups, setStakeholdersGroupsMeta } =
    useStakeholdersGroupsStore((state) => ({
      setStakeholdersGroups: state.setStakeholdersGroups,
      setStakeholdersGroupsMeta: state.setStakeholdersGroupsMeta,
    }));

  const query = useQuery({
    queryKey: ['stakeholdersGroups', uuid, payload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aaProject.stakeholders.getAllGroups',
          payload: payload,
        },
      });
      return mutate.response;
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (query?.data) {
      setStakeholdersGroups(query?.data?.data);
      setStakeholdersGroupsMeta(query?.data?.meta);
    }
  }, [query.data]);

  return { ...query, stakeholdersGroupsMeta: query?.data?.meta };
};

export const useUpdateStakeholdersGroups = () => {
  const qc = useQueryClient();
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({
      projectUUID,
      stakeholdersGroupPayload,
    }: {
      projectUUID: UUID;
      stakeholdersGroupPayload: {
        uuid: string;
        name?: string;
        stakeholders?: Array<{
          uuid: string;
        }>;
      };
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aaProject.stakeholders.updateGroup',
          payload: stakeholdersGroupPayload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({
        queryKey: ['stakeholdersGroups', 'stakeholders'],
      });
      toast.fire({
        title: 'Stakeholders group updated successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while updating stakeholders group.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useDeleteStakeholdersGroups = () => {
  const qc = useQueryClient();
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({
      projectUUID,
      stakeholdersGroupPayload,
    }: {
      projectUUID: UUID;
      stakeholdersGroupPayload: {
        uuid: string;
      };
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aaProject.stakeholders.deleteGroup',
          payload: stakeholdersGroupPayload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({
        queryKey: ['stakeholdersGroups', 'stakeholders'],
      });
      toast.fire({
        title: 'Stakeholders Group removed successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while removing stakeholders group.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

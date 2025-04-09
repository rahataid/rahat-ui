'use client';
import { useEffect } from 'react';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useProjectAction } from '../../projects';
import { useStakeholdersStore } from './stakeholders.store';
import { UUID } from 'crypto';
import { useSwal } from 'libs/query/src/swal';

interface IStakeholdersUpdatePayload {
  uuid: string;
  name?: string;
  phone?: string;
  email?: string;
  designation?: string;
  organization?: string;
  district?: string;
  municipality?: string;
}

export const useStakeholders = (uuid: UUID, payload: any) => {
  const q = useProjectAction();
  const { setStakeholders, setStakeholdersMeta } = useStakeholdersStore(
    (state) => ({
      setStakeholders: state.setStakeholders,
      setStakeholdersMeta: state.setStakeholdersMeta,
    }),
  );

  const query = useQuery({
    queryKey: ['stakeholders', uuid, payload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aaProject.stakeholders.getAll',
          payload: payload,
        },
      });
      return mutate.response;
    },
  });

  useEffect(() => {
    if (query?.data) {
      setStakeholders(query?.data?.data);
      setStakeholdersMeta(query?.data?.meta);
    }
  }, [query.data]);

  return { ...query, stakeholdersMeta: query?.data?.meta };
};

export const useCreateStakeholders = () => {
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
      stakeholderPayload,
    }: {
      projectUUID: UUID;
      stakeholderPayload: any;
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aaProject.stakeholders.add',
          payload: stakeholderPayload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      toast.fire({
        title: 'Stakeholder added successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while adding stakeholder.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useUpdateStakeholders = () => {
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
      stakeholderPayload,
    }: {
      projectUUID: UUID;
      stakeholderPayload: IStakeholdersUpdatePayload;
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aaProject.stakeholders.update',
          payload: stakeholderPayload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({ queryKey: ['stakeholders'] });
      toast.fire({
        title: 'Stakeholder updated successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while updating stakeholder.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useDeleteStakeholders = () => {
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
      stakeholderPayload,
    }: {
      projectUUID: UUID;
      stakeholderPayload: {
        uuid: string;
      };
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aaProject.stakeholders.remove',
          payload: stakeholderPayload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({ queryKey: ['stakeholders'] });
      toast.fire({
        title: 'Stakeholder removed successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while removing stakeholder.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useStakeholderDetails = (
  uuid: UUID,
  payload: { uuid: string },
) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['stakeholder', uuid, payload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aaProject.stakeholders.getOne',
          payload: payload,
        },
      });
      return mutate.data;
    },
  });
  return query?.data;
};

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useProjectAction } from '../../projects';
import { useSwal } from 'libs/query/src/swal';
import { UUID } from 'crypto';

const MS_ACTIONS = {
  IVR_TEMPLATES: {
    LIST: 'aaProject.ivrTemplates.list',
    GET: 'aaProject.ivrTemplates.get',
    CREATE: 'aaProject.ivrTemplates.create',
    UPDATE: 'aaProject.ivrTemplates.update',
    DELETE: 'aaProject.ivrTemplates.delete',
  },
};

export type IvrTemplate = {
  id: number;
  name: string;
  description?: string;
  flowUrl?: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
};

export type CreateIvrTemplatePayload = {
  name: string;
  description?: string;
  flowUrl?: string;
};

export type UpdateIvrTemplatePayload = {
  flowUrl?: string;
  name?: string;
  description?: string;
  status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
};

export const useIvrTemplates = (projectUUID: UUID) => {
  const q = useProjectAction<any[]>();

  return useQuery({
    queryKey: [MS_ACTIONS.IVR_TEMPLATES.LIST, projectUUID],
    enabled: !!projectUUID,
    queryFn: async () => {
      const res = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: MS_ACTIONS.IVR_TEMPLATES.LIST,
          payload: {},
        },
      });
      return res?.data;
    },
  });
};

export const useIvrTemplateDetail = (projectUUID: UUID, id: number) => {
  const q = useProjectAction<any>();

  return useQuery({
    queryKey: [MS_ACTIONS.IVR_TEMPLATES.GET, projectUUID, id],
    enabled: !!projectUUID && !!id,
    queryFn: async () => {
      const res = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: MS_ACTIONS.IVR_TEMPLATES.GET,
          payload: { id },
        },
      });
      return res?.data;
    },
  });
};

export const useIvrTemplateCreate = () => {
  const queryClient = useQueryClient();
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
      payload,
    }: {
      projectUUID: UUID;
      payload: CreateIvrTemplatePayload;
    }) => {
      const res = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: MS_ACTIONS.IVR_TEMPLATES.CREATE,
          payload,
        },
      });
      return res?.data;
    },
    onSuccess: () => {
      q.reset();
      queryClient.invalidateQueries({
        queryKey: [MS_ACTIONS.IVR_TEMPLATES.LIST],
      });
      toast.fire({
        title: 'IVR template created successfully.',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      q.reset();
      const errorMessage = error?.response?.data?.message || 'Error';
      toast.fire({
        title: 'Error while creating IVR template.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useIvrTemplateUpdate = () => {
  const queryClient = useQueryClient();
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
      id,
      payload,
    }: {
      projectUUID: UUID;
      id: number;
      payload: UpdateIvrTemplatePayload;
    }) => {
      const res = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: MS_ACTIONS.IVR_TEMPLATES.UPDATE,
          payload: { id, ...payload },
        },
      });
      return res?.data;
    },
    onSuccess: (_data, variables) => {
      q.reset();
      queryClient.invalidateQueries({
        queryKey: [MS_ACTIONS.IVR_TEMPLATES.LIST],
      });
      queryClient.invalidateQueries({
        queryKey: [
          MS_ACTIONS.IVR_TEMPLATES.GET,
          variables.projectUUID,
          variables.id,
        ],
      });
    },
    onError: (error: any) => {
      q.reset();
      const errorMessage = error?.response?.data?.message || 'Error';
      toast.fire({
        title: 'Error while updating IVR template.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useIvrTemplateDelete = () => {
  const queryClient = useQueryClient();
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
      id,
    }: {
      projectUUID: UUID;
      id: number;
    }) => {
      const res = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: MS_ACTIONS.IVR_TEMPLATES.DELETE,
          payload: { id },
        },
      });
      return res?.data;
    },
    onSuccess: () => {
      q.reset();
      queryClient.invalidateQueries({
        queryKey: [MS_ACTIONS.IVR_TEMPLATES.LIST],
      });
      toast.fire({
        title: 'IVR template archived successfully.',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      q.reset();
      const errorMessage = error?.response?.data?.message || 'Error';
      toast.fire({
        title: 'Error while deleting IVR template.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
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
    SEND_TEST_CALL: 'aaProject.ivrTemplates.sendTestCall',
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
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
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
        title: t('IVR_TEMPLATE_CREATED_SUCCESSFULLY'),
        icon: 'success',
      });
    },
    onError: (error: any) => {
      q.reset();
      const errorMessage = error?.response?.data?.message || tg('ERROR');
      toast.fire({
        title: t('ERROR_WHILE_CREATING_IVR_TEMPLATE'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useIvrTemplateUpdate = () => {
  const queryClient = useQueryClient();
  const q = useProjectAction();
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
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
      const errorMessage = error?.response?.data?.message || tg('ERROR');
      toast.fire({
        title: t('ERROR_WHILE_UPDATING_IVR_TEMPLATE'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useIvrTemplateDelete = () => {
  const queryClient = useQueryClient();
  const q = useProjectAction();
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
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
        title: t('IVR_TEMPLATE_ARCHIVED_SUCCESSFULLY'),
        icon: 'success',
      });
    },
    onError: (error: any) => {
      q.reset();
      const errorMessage = error?.response?.data?.message || tg('ERROR');
      toast.fire({
        title: t('ERROR_WHILE_DELETING_IVR_TEMPLATE'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useIvrTestCall = () => {
  const q = useProjectAction();
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
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
      payload: { phoneNumber: string; flowUrl: string };
    }) => {
      const res = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: MS_ACTIONS.IVR_TEMPLATES.SEND_TEST_CALL,
          payload,
        },
      });
      return res?.data;
    },
    onSuccess: () => {
      q.reset();
      toast.fire({
        title: t('TEST_CALL_SENT_SUCCESSFULLY'),
        icon: 'success',
      });
    },
    onError: (error: any) => {
      q.reset();
      const errorMessage = error?.response?.data?.message || tg('ERROR');
      toast.fire({
        title: t('ERROR_SENDING_TEST_CALL'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

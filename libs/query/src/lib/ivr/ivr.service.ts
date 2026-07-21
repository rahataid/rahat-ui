'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { useSwal } from 'libs/query/src/swal';

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

const listIvrTemplates = async (): Promise<IvrTemplate[]> => {
  const response = await api.get('/ivr-templates');
  return response?.data?.data;
};

const getIvrTemplate = async (id: number): Promise<IvrTemplate> => {
  const response = await api.get(`/ivr-templates/${id}`);
  return response?.data?.data;
};

const createIvrTemplate = async (
  payload: CreateIvrTemplatePayload,
): Promise<IvrTemplate> => {
  const response = await api.post('/ivr-templates', payload);
  return response?.data?.data;
};

const updateIvrTemplate = async (
  id: number,
  payload: UpdateIvrTemplatePayload,
): Promise<IvrTemplate> => {
  const response = await api.patch(`/ivr-templates/${id}`, payload);
  return response?.data?.data;
};

export const useIvrTemplates = () => {
  return useQuery({
    queryKey: ['ivr-templates'],
    queryFn: listIvrTemplates,
  });
};

export const useIvrTemplateDetail = (id: number) => {
  return useQuery({
    queryKey: ['ivr-templates', id],
    queryFn: () => getIvrTemplate(id),
    enabled: !!id,
  });
};

export const useIvrTemplateCreate = () => {
  const queryClient = useQueryClient();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });

  return useMutation({
    mutationFn: (payload: CreateIvrTemplatePayload) =>
      createIvrTemplate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ivr-templates'] });
      toast.fire({
        title: 'IVR template created successfully.',
        icon: 'success',
      });
    },
    onError: (error: any) => {
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
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateIvrTemplatePayload }) =>
      updateIvrTemplate(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ivr-templates'] });
      queryClient.invalidateQueries({ queryKey: ['ivr-templates', variables.id] });
      toast.fire({
        title: 'IVR template updated successfully.',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      toast.fire({
        title: 'Error while updating IVR template.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

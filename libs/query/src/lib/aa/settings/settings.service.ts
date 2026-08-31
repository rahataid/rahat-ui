import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { useTranslations } from 'next-intl';
import { useProjectAction } from '../../projects';
import { useSwal } from '../../../swal';

export enum SettingDataType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  OBJECT = 'OBJECT',
}

export type SettingNameValue = {
  name: string;
  value: unknown;
  // Required only when the setting does not exist yet and needs to be
  // created via upsert on the backend.
  dataType?: SettingDataType;
};

export const useAAProjectSettingsList = (projectUUID: UUID) => {
  const q = useProjectAction<any>();
  return useQuery({
    queryKey: ['aa.settings.list', projectUUID],
    enabled: !!projectUUID,
    refetchOnMount: true,
    queryFn: async () => {
      const res = await q.mutateAsync({
        uuid: projectUUID,
        data: { action: 'settings.list', payload: {} },
      });
      return res.data;
    },
  });
};

export const useAAProjectSettingsUpdateValues = () => {
  const q = useProjectAction<any>();
  const queryClient = useQueryClient();
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
      settings,
    }: {
      projectUUID: UUID;
      settings: SettingNameValue[];
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'ms.settings.updateValues',
          payload: { settings },
        },
      });
    },
    onSuccess: (_, { projectUUID }) => {
      // Settings are read all over the app under different query key
      // shapes (['aa.settings.list', uuid], [name, uuid], ['settings.get',
      // uuid, name], ...). Invalidate anything keyed by this project so
      // every tab/page relying on a setting refetches fresh data.
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes(projectUUID),
      });
      toast.fire({ title: 'Settings updated successfully', icon: 'success' });
    },
    onError: (error: any) => {
      toast.fire({
        title: 'Failed to update settings',
        icon: 'error',
        text: error?.response?.data?.message,
      });
    },
  });
};

export const useAAProjectSettingsAdd = () => {
  const q = useProjectAction<any>();
  const queryClient = useQueryClient();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  const tb = useTranslations();
  return useMutation({
    mutationFn: async ({
      projectUUID,
      dto,
    }: {
      projectUUID: UUID;
      dto: any;
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: { action: 'settings.add', payload: dto },
      });
    },
    onSuccess: (_, { projectUUID }) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes(projectUUID),
      });
      toast.fire({ title: 'Setting added successfully', icon: 'success' });
    },
    onError: (error: any) => {
      toast.fire({
        title: 'Failed to add setting',
        icon: 'error',
        text: error?.response?.data?.message,
      });
    },
  });
};

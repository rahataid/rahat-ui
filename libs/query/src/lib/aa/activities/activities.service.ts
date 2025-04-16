'use client';
import { useEffect } from 'react';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useProjectAction, useProjectSettingsStore } from '../../projects';
import { useActivitiesStore } from './activities.store';
import { UUID } from 'crypto';
import { useSwal } from 'libs/query/src/swal';
import { PROJECT_SETTINGS_KEYS } from 'libs/query/src/config';

export const useActivitiesCategories = (uuid: UUID) => {
  const q = useProjectAction();
  const { setCategories } = useActivitiesStore((state) => ({
    setCategories: state.setCategories,
  }));

  const query = useQuery({
    queryKey: ['categories', uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.activityCategories.getAll',
          payload: {},
        },
      });
      return mutate.data;
    },
  });

  useEffect(() => {
    if (query.data) {
      setCategories(query?.data);
    }
  }, [query.data]);
  return query;
};

export const useActivities = (uuid: UUID, payload: any) => {
  const q = useProjectAction();
  const { settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
  }));
  const { setActivities, setActivitiesMeta } = useActivitiesStore((state) => ({
    setActivities: state.setActivities,
    setActivitiesMeta: state.setActivitiesMeta,
  }));

  const query = useQuery({
    queryKey: ['activities', uuid, payload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.activities.getAll',
          payload: {
            ...payload,
            activeYear:
              settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.[
                'active_year'
              ],
            riverBasin:
              settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.[
                'river_basin'
              ],
          },
        },
      });
      return mutate.response;
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (query?.data) {
      setActivities(query?.data?.data);
      setActivitiesMeta(query?.data?.meta);
    }
  }, [query.data]);

  const activitiesData = query?.data?.data?.map((d: any) => ({
    id: d.uuid,
    title: d.title,
    responsibility: d?.manager?.name,
    source: d?.phase?.source?.riverBasin,
    hazardType: d.hazardType?.name,
    category: d.category?.name,
    description: d.description,
    phase: d.phase?.name,
    status: d.status,
    activityType: d.activityType,
    campaignId: d?.activityComm?.campaignId || null,
    activtiyComm: d?.activityComm || null,
    isAutomated: d?.isAutomated,
    completedBy: d?.completedBy,
    completedAt: d?.completedAt,
    activityDocuments: d?.activityDocuments || null,
    createdAt: d?.createdAt,
    notes: d?.notes,
    timeDifference: d?.differenceInTriggerAndActivityCompletion,
    leadTime: d?.leadTime,
  }));

  return { ...query, activitiesData, activitiesMeta: query?.data?.meta };
};

export const useActivitiesHavingComms = (uuid: UUID, payload: any) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['activitiesHavingComms', uuid, payload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aaProject.activities.getHavingComms',
          payload: payload,
        },
      });
      return mutate.response;
    },
  });
  const activitiesData = query?.data?.data?.map((d: any) => ({
    id: d?.uuid,
    title: d?.title,
    createdAt: d?.createdAt,
    phase: d?.phase?.name,
    status: d?.status,
    activityCommunication: d?.activityCommunication,
  }));
  return { activitiesData, activitiesMeta: query?.data?.data?.meta };
};

export const useSingleActivity = (
  uuid: UUID,
  activityId: string | string[],
) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['activity', uuid, activityId],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.activities.getOne',
          payload: {
            uuid: activityId,
          },
        },
      });
      return mutate.data;
    },
  });
  return query;
};

export const useCreateActivities = () => {
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
      activityPayload,
    }: {
      projectUUID: UUID;
      activityPayload: any;
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'ms.activities.add',
          payload: activityPayload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      toast.fire({
        title: 'Activity added successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while adding activity.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useUpdateActivities = () => {
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
      activityUpdatePayload,
    }: {
      projectUUID: UUID;
      activityUpdatePayload: any;
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'ms.activities.update',
          payload: activityUpdatePayload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({ queryKey: ['activities'] });
      qc.invalidateQueries({ queryKey: ['activity'] });
      qc.invalidateQueries({ queryKey: ['activitiesHavingComms'] });
      toast.fire({
        title: 'Activity updated successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while updating activity.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useDeleteActivities = () => {
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
      activityPayload,
    }: {
      projectUUID: UUID;
      activityPayload: {
        uuid: string;
      };
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'ms.activities.remove',
          payload: activityPayload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({ queryKey: ['activities'] });
      qc.invalidateQueries({ queryKey: ['activitiesHavingComms'] });
      toast.fire({
        title: 'Activity removed successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while removing activity.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useTriggerCommunication = () => {
  const q = useProjectAction();
  const qc = useQueryClient();
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
      activityCommunicationPayload,
    }: {
      projectUUID: UUID;
      activityCommunicationPayload: any;
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'ms.activities.communication.trigger',
          payload: activityCommunicationPayload,
        },
      });
    },

    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({ queryKey: ['activity'] });
      toast.fire({
        title: 'Communication Trigger successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while triggering communication.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useUpdateActivityStatus = () => {
  const q = useProjectAction();
  const qc = useQueryClient();
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
      activityStatusPayload,
    }: {
      projectUUID: UUID;
      activityStatusPayload: {
        uuid: string;
        status: string;
        activityDocuments?: Array<{ fileName: string; mediaURL: string }>;
        notes?: string;
      };
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'ms.activities.updateStatus',
          payload: activityStatusPayload,
        },
      });
    },

    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({ queryKey: ['activities'] });
      qc.invalidateQueries({ queryKey: ['activity'] });
      toast.fire({
        title: 'Status Updated',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Status Update Failed',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

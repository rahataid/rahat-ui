'use client';
import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useProjectAction, useProjectSettingsStore } from '../../projects';
import { useActivitiesStore } from './activities.store';
import { ACTIVITY_QUERY_KEYS } from './activities.constants';
import { UUID } from 'crypto';
import { PROJECT_SETTINGS_KEYS } from 'libs/query/src/config';
import { useTranslations } from 'next-intl';
import { resolveBackendErrorMessage } from '../../../utils/i18n/backend-error';
import { toast } from 'react-toastify';
import { showToast } from 'libs/query/src/utils/custom-toast';

type ActivityTemplateFilters = {
  page?: number;
  perPage?: number;
  phase?: string;
  hasCommunication?: string;
  category?: string;
  title?: string;
  isAutomated?: string;
  appId?: string;
};
export const useActivitiesCategories = (uuid: UUID) => {
  const q = useProjectAction();
  const { setCategories } = useActivitiesStore((state) => ({
    setCategories: state.setCategories,
  }));

  const query = useQuery({
    queryKey: [ACTIVITY_QUERY_KEYS.CATEGORIES, uuid],
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

export const useAddActivityCategory = () => {
  const q = useProjectAction();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ uuid, name }: { uuid: UUID; name: string }) => {
      const result = await q.mutateAsync({
        uuid,
        data: { action: 'ms.activityCategories.add', payload: { name } },
      });
      return result.data;
    },
    onSuccess: (_, { uuid }) => {
      queryClient.invalidateQueries({
        queryKey: [ACTIVITY_QUERY_KEYS.CATEGORIES, uuid],
      });
    },
  });
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
    queryKey: [ACTIVITY_QUERY_KEYS.ACTIVITIES, uuid, payload],
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
    staleTime: 30 * 60 * 1000, // 30 minutes
    placeholderData: (previousData, previousQuery) =>
      previousQuery?.queryKey?.[1] === uuid ? previousData : undefined,
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
    responsibleStation: d.responsibleStation,
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
    activityCommunication: d?.activityCommunication || null,
    createdAt: d?.createdAt,
    notes: d?.notes,
    timeDifference: d?.differenceInTriggerAndActivityCompletion,
    leadTime: d?.leadTime,
  }));

  return { ...query, activitiesData, activitiesMeta: query?.data?.meta };
};

export const useActivitiesHavingComms = (uuid: UUID, payload: any) => {
  const q = useProjectAction();
  const { settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
  }));
  const query = useQuery({
    queryKey: [ACTIVITY_QUERY_KEYS.ACTIVITIES_HAVING_COMMS, uuid, payload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.activities.getHavingComms',
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
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
  const activitiesData = query?.data?.data?.map((d: any) => ({
    id: d?.uuid,
    title: d?.title,
    createdAt: d?.createdAt,
    updatedAt: d?.updatedAt,
    phase: d?.phase?.name,
    status: d?.status,
    activityCommunication: d?.activityCommunication,
    commStatus: d?.commStatus,
  }));
  return {
    activitiesData,
    activitiesMeta: query?.data?.meta,
    isLoading: query?.isLoading,
  };
};

export const useSingleActivity = (
  uuid: UUID,
  activityId: string | string[],
) => {
  const t = useTranslations('AA_PROJECT');
  const q = useProjectAction();

  const query = useQuery({
    queryKey: [ACTIVITY_QUERY_KEYS.ACTIVITY, uuid, activityId],
    queryFn: async () => {
      try {
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
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message || t('FAILED_TO_FETCH_ACTIVITY');
        showToast({
          type: 'error',
          title: t('ERROR_LOADING_ACTIVITY'),
          description: errorMessage,
        });
        throw error;
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
  return query;
};

export const useCreateActivities = () => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const qc = useQueryClient();

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
    onSuccess: (data) => {
      q.reset();
      qc.invalidateQueries({ queryKey: [ACTIVITY_QUERY_KEYS.ACTIVITIES] });
      toast.success(
        data?.data?.isTemplate
          ? t('ACTIVITY_AND_TEMPLATE_ADDED_SUCCESSFULLY')
          : t('ACTIVITY_CREATED_SUCCESSFULLY'),
      );
    },
    onError: (error: any) => {
      const rawMessage = error?.response?.data?.message || t('ERROR');
      const codeResolvedMessage = resolveBackendErrorMessage(
        tb,
        error?.response?.data?.code,
        error?.response?.data?.params,
        ['ACTIVITIES'],
        rawMessage,
      );
      const errorMessage =
        codeResolvedMessage !== rawMessage
          ? codeResolvedMessage
          : rawMessage === 'Something went wrong'
          ? tb('BACKEND.ACTIVITIES.SOMETHING_WENT_WRONG' as never)
          : rawMessage;
      q.reset();
      showToast({
        type: 'error',
        title: t('ERROR_WHILE_ADDING_ACTIVITY'),
        description: errorMessage,
      });
    },
  });
};

export const useValidateBulkAddActivities = () => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();

  return useMutation({
    mutationFn: async ({
      projectUUID,
      activities,
    }: {
      projectUUID: UUID;
      activities: any[];
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'ms.activities.validateBulkAdd',
          payload: { data: activities },
        },
      });
    },
    onSuccess: () => {
      q.reset();
    },
    onError: (error: any) => {
      const rawMessage = error?.response?.data?.message || t('ERROR');
      const codeResolvedMessage = resolveBackendErrorMessage(
        tb,
        error?.response?.data?.code,
        error?.response?.data?.params,
        ['ACTIVITIES'],
        rawMessage,
      );
      const errorMessage =
        codeResolvedMessage !== rawMessage
          ? codeResolvedMessage
          : rawMessage === 'Something went wrong'
          ? tb('BACKEND.ACTIVITIES.SOMETHING_WENT_WRONG' as never)
          : rawMessage;
      q.reset();
      showToast({
        type: 'error',
        title: t('ERROR_WHILE_VALIDATING_ACTIVITIES'),
        description: errorMessage,
      });
    },
  });
};

export const useBulkAddActivities = () => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectUUID,
      activities,
    }: {
      projectUUID: UUID;
      activities: any[];
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'ms.activities.bulkAdd',
          payload: { data: activities },
        },
      });
    },
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({ queryKey: [ACTIVITY_QUERY_KEYS.ACTIVITIES] });
    },
    onError: (error: any) => {
      const rawMessage = error?.response?.data?.message || t('ERROR');
      const codeResolvedMessage = resolveBackendErrorMessage(
        tb,
        error?.response?.data?.code,
        error?.response?.data?.params,
        ['ACTIVITIES'],
        rawMessage,
      );
      const errorMessage =
        codeResolvedMessage !== rawMessage
          ? codeResolvedMessage
          : rawMessage === 'Something went wrong'
          ? tb('BACKEND.ACTIVITIES.SOMETHING_WENT_WRONG' as never)
          : rawMessage;
      q.reset();
      showToast({
        type: 'error',
        title: t('ERROR_WHILE_SUBMITTING_ACTIVITIES'),
        description: errorMessage,
      });
    },
  });
};

export const useUpdateActivities = () => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const qc = useQueryClient();
  const q = useProjectAction();

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
      qc.invalidateQueries({ queryKey: [ACTIVITY_QUERY_KEYS.ACTIVITIES] });
      qc.invalidateQueries({ queryKey: [ACTIVITY_QUERY_KEYS.ACTIVITY] });
      qc.invalidateQueries({
        queryKey: [ACTIVITY_QUERY_KEYS.ACTIVITIES_HAVING_COMMS],
      });
      toast.success(t('ACTIVITY_UPDATED_SUCCESSFULLY'));
    },
    onError: (error: any) => {
      const rawMessage = error?.response?.data?.message || t('ERROR');
      const errorMessage = resolveBackendErrorMessage(
        tb,
        error?.response?.data?.code,
        error?.response?.data?.params,
        ['ACTIVITIES'],
        rawMessage,
      );
      q.reset();
      showToast({
        type: 'error',
        title: t('ERROR_WHILE_UPDATING_ACTIVITY'),
        description: errorMessage,
      });
    },
  });
};

export const useDeleteActivities = () => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const qc = useQueryClient();
  const q = useProjectAction();

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
      qc.invalidateQueries({ queryKey: [ACTIVITY_QUERY_KEYS.ACTIVITIES] });
      qc.invalidateQueries({
        queryKey: [ACTIVITY_QUERY_KEYS.ACTIVITIES_HAVING_COMMS],
      });
      toast.success(t('ACTIVITY_REMOVED_SUCCESSFULLY'));
    },
    onError: (error: any) => {
      const rawMessage = error?.response?.data?.message || t('ERROR');
      const codeResolvedMessage = resolveBackendErrorMessage(
        tb,
        error?.response?.data?.code,
        error?.response?.data?.params,
        ['ACTIVITIES'],
        rawMessage,
      );
      const errorMessage =
        codeResolvedMessage !== rawMessage
          ? codeResolvedMessage
          : rawMessage === 'Something went wrong'
          ? tb('BACKEND.ACTIVITIES.SOMETHING_WENT_WRONG' as never)
          : rawMessage;
      q.reset();
      showToast({
        type: 'error',
        title: t('ERROR_WHILE_REMOVING_ACTIVITY'),
        description: errorMessage,
      });
    },
  });
};

export const useTriggerCommunication = () => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const qc = useQueryClient();

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
      qc.invalidateQueries({ queryKey: [ACTIVITY_QUERY_KEYS.ACTIVITY] });
      toast.success(t('COMMUNICATION_TRIGGER_SUCCESSFULLY'));
    },
    onError: (error: any) => {
      const rawMessage = error?.response?.data?.message || t('ERROR');
      const errorMessage = resolveBackendErrorMessage(
        tb,
        error?.response?.data?.code,
        error?.response?.data?.params,
        ['ACTIVITIES'],
        rawMessage,
      );
      q.reset();
      showToast({
        type: 'error',
        title: t('ERROR_WHILE_TRIGGERING_COMMUNICATION'),
        description: errorMessage,
      });
    },
  });
};

export const useUpdateActivityStatus = () => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const qc = useQueryClient();

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
      qc.invalidateQueries({ queryKey: [ACTIVITY_QUERY_KEYS.ACTIVITIES] });
      qc.invalidateQueries({ queryKey: [ACTIVITY_QUERY_KEYS.ACTIVITY] });
      toast.success(t('STATUS_UPDATED'));
    },
    onError: (error: any) => {
      const rawMessage = error?.response?.data?.message || t('ERROR');
      const errorMessage = resolveBackendErrorMessage(
        tb,
        error?.response?.data?.code,
        error?.response?.data?.params,
        ['ACTIVITIES'],
        rawMessage,
      );
      q.reset();
      showToast({
        type: 'error',
        title: t('STATUS_UPDATE_FAILED'),
        description: errorMessage,
      });
    },
  });
};

export const useActivityTemplates = (
  uuid: UUID,
  filters: ActivityTemplateFilters,
) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: [ACTIVITY_QUERY_KEYS.ACTIVITY_TEMPLATES, uuid, filters],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.library.getActivityTemplates',
          payload: {
            ...filters,
          },
        },
      });
      return mutate.response;
    },
  });
  return query;
};

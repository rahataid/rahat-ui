import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useProjectAction } from '../../projects';
import { UUID } from 'crypto';
import { toast } from 'react-toastify';
import { showToast } from 'libs/query/src/utils/custom-toast';
import { useTranslations } from 'next-intl';
import { resolveBackendErrorMessage } from '../../../utils/i18n/backend-error';

export const useGetCommunicationLogs = (
  uuid: UUID,
  communicationId: string,
  activityId: string,
) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['communicationlogs', uuid, communicationId, activityId],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.activities.communication.sessionLogs',
          payload: {
            communicationId,
            activityId,
          },
        },
      });
      return mutate.data;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  return query;
};

export const useRetryFailedBroadcast = (
  uuid: UUID,
  communicationId: string,
  activityId: string,
) => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();

  return useMutation({
    // queryKey: ['retryfailed', uuid, communicationId],
    mutationFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aa.activities.communication.retryFailed',
          payload: {
            communicationId,
            activityId,
          },
        },
      });
      return mutate.data;
    },
    onSuccess: () => {
      q.reset();
      toast.success(t('SUCCESS'));
    },
    onError: (error: any) => {
      const rawMessage = error?.response?.data?.message || 'An error occured!';
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
        title: t('ERROR_WHILE_ADDING_ACTIVITY'),
        description: errorMessage,
      });
    },
  });
};

// export const useRetryFailedBroadcast = (sessionId: string) => {
//   const q = useProjectAction();

//   const query = useQuery({
//     queryKey: ['retryFailed', sessionId],
//     // queryFn:
//   });

//   return query;
// };

// export const useListAllTransports = (sessionId: string) => {
//   const { newCommunicationService } = useNewCommunicationQuery()

//   const query = useQuery({
//     queryFn: () => newCommunicationService.transport.list(),
//     queryKey: [TAGS.NEW_COMMS.RETRY_FAILED, sessionId],
//   })

//   return query?.data?.data;
// };

export const useGetIndividualLogs = (
  uuid: UUID,
  communication: string,
  payload?: any,
) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['communicationLogs', uuid, communication, payload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.activities.getComms',
          payload: {
            filters: {
              transportName: communication,
              title: payload?.filters?.title || '',
              groupName: payload?.filters?.group_name || '',
              groupType: payload?.filters?.group_type || '',
              sessionStatus: payload?.filters?.sessionStatus || '',
            },

            page: payload.page,
            perPage: payload.perPage,
          },
        },
      });
      return mutate;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  return {
    IndividualLogs: query?.data?.data,
    isLoading: query.isLoading,
    IndividualMeta: query?.data?.response.meta,
  };
};

export type CreateBroadcastPayload = {
  title: string;
  targets: { groupId: string; groupType: 'BENEFICIARY' | 'STAKEHOLDERS' }[];
  message?: string;
  subject?: string;
  audioURL?: { mediaURL: string; fileName: string };
  transportId?: string;
};

export const useCreateCommunication = () => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectUUID,
      broadcastPayload,
    }: {
      projectUUID: UUID;
      broadcastPayload: CreateBroadcastPayload;
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'ms.communications.create',
          payload: broadcastPayload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({ queryKey: ['ms.communications.getAll'] });
      toast.success(t('ADDED_SUCCESSFULLY'));
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
        title: t('ERROR'),
        description: errorMessage,
      });
    },
  });
};

export const useListCommunications = (
  uuid: UUID,
  payload?: {
    page?: number;
    perPage?: number;
    title?: string;
    status?: string;
    transportId?: string;
  },
) => {
  const q = useProjectAction();

  const payloadString = JSON.stringify(payload ?? {});

  const query = useQuery({
    queryKey: ['ms.communications.getAll', uuid, payloadString],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.communications.getAll',
          payload: {
            page: payload?.page ?? 1,
            perPage: payload?.perPage ?? 100,
            ...(payload?.title ? { title: payload.title } : {}),
            ...(payload?.status ? { status: payload.status } : {}),
            ...(payload?.transportId ? { transportId: payload.transportId } : {}),
          },
        },
      });
      return mutate?.response ?? mutate?.data ?? mutate;
    },
    staleTime: 60 * 1000,
  });

  return query;
};

export const useGetCommunication = (uuid: UUID, communicationUUID: string) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['ms.communications.getOne', uuid, communicationUUID],
    enabled: !!uuid && !!communicationUUID,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.communications.getOne',
          payload: { uuid: communicationUUID },
        },
      });
      return mutate?.data ?? mutate?.response ?? mutate;
    },
    staleTime: 60 * 1000,
  });

  return query;
};

export const useDeleteCommunication = () => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectUUID,
      communicationUUID,
    }: {
      projectUUID: UUID;
      communicationUUID: string;
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'ms.communications.remove',
          payload: { uuid: communicationUUID },
        },
      });
    },
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({ queryKey: ['ms.communications.getAll'] });
      toast.success(t('SUCCESS'));
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
        title: t('ERROR'),
        description: errorMessage,
      });
    },
  });
};

export const useTriggerCommunicationBroadcast = () => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectUUID,
      communicationUUID,
    }: {
      projectUUID: UUID;
      communicationUUID: string;
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'ms.communications.trigger',
          payload: { uuid: communicationUUID },
        },
      });
    },
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({ queryKey: ['ms.communications.getAll'] });
      toast.success(t('COMMUNICATION_TRIGGER_SUCCESSFULLY'));
    },
    onError: (error: any) => {
      const rawMessage = error?.response?.data?.message || t('ERROR');
      const isCommsUnavailable =
        typeof rawMessage === 'string' &&
        rawMessage.includes("reading 'transport'");
      const errorMessage = isCommsUnavailable
        ? tb('BACKEND.ACTIVITIES.COMMS_CLIENT_NOT_AVAILABLE' as never)
        : resolveBackendErrorMessage(
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

import { useMutation, useQuery } from '@tanstack/react-query';
import { useProjectAction } from '../../projects';
import { UUID } from 'crypto';
import { toast } from 'react-toastify';
import { showToast } from 'libs/query/src/utils/custom-toast';
import { title } from 'process';
import { group } from 'console';
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

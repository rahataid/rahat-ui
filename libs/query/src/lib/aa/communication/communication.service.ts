import { useMutation, useQuery } from '@tanstack/react-query';
import { useProjectAction } from '../../projects';
import { UUID } from 'crypto';
import { useSwal } from 'libs/query/src/swal';
import { title } from 'process';
import { group } from 'console';

export const useGetCommunicationLogs = (
  uuid: UUID,
  communicationId: string,
  activityId: string,
) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['communicationlogs', uuid, communicationId],
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
  });

  return query;
};

export const useRetryFailedBroadcast = (
  uuid: UUID,
  communicationId: string,
  activityId: string,
) => {
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });

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
      toast.fire({
        title: 'Success!',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || 'An error occured!';
      q.reset();
      toast.fire({
        title: 'Error while adding activity.',
        icon: 'error',
        text: errorMessage,
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
  });

  return {
    IndividualLogs: query?.data?.data,
    isLoading: query.isLoading,
    IndividualMeta: query?.data?.response.meta,
  };
};

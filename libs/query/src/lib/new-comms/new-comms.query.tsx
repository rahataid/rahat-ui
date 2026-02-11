import { useMutation, useQuery } from '@tanstack/react-query';
import { useNewCommunicationQuery } from './new-comms.provider';
import { TAGS } from '../../config';
import Swal from 'sweetalert2';

type RetryFailedPayload = {
  cuid: string;
  includeFailed?: boolean;
};
export const useListAllTransports = () => {
  const { newCommunicationService } = useNewCommunicationQuery();

  const query = useQuery({
    queryFn: () => newCommunicationService.transport.list(),
    queryKey: [TAGS.NEW_COMMS.LIST_TRANSPORTS],
    staleTime: 6 * 60 * 60 * 1000, // 6 hours
  });

  return query?.data?.data;
};

export const useListSessionLogs = (sessionId: string, payload: any) => {
  const { newCommunicationService } = useNewCommunicationQuery();

  const query = useQuery({
    queryFn: () =>
      newCommunicationService.session.listBroadcasts(sessionId, payload),

    queryKey: ['TAGS.NEW_COMMS.LIST_TRANSPORTS', payload],
    staleTime: 60 * 60 * 1000, // 1 hour
  });
  return query;
};

export const useSessionRetryFailed = () => {
  const { newCommunicationService, newQueryClient } =
    useNewCommunicationQuery();

  const mutation = useMutation({
    mutationFn: (payload: RetryFailedPayload) =>
      newCommunicationService.session.retryIncomplete(
        payload.cuid,
        payload.includeFailed,
      ),

    mutationKey: [TAGS.NEW_COMMS.RETRY_FAILED],
    onSuccess: (_, variables) => {
      const sessionId = variables.cuid;
      console.log('Retry success for:', sessionId);
      newQueryClient.invalidateQueries({
        queryKey: ['TAGS.NEW_COMMS.LIST_TRANSPORTS', { type: sessionId }],
      });
      Swal.fire('Retry Successfully', '', 'success');
    },
    onError: (error: any) => {
      Swal.fire(
        'You’ve reached the maximum number of retries',
        error?.response.data.message === 'Session is completed'
          ? 'No further retries possible'
          : error?.response.data.message,
        'error',
      );
    },
  });

  return mutation;
};

export const useSessionBroadCastCount = (sessions: string[]) => {
  const { newCommunicationService } = useNewCommunicationQuery();

  const query = useQuery({
    queryFn: () => newCommunicationService.session.broadcastCount({ sessions }),

    queryKey: [TAGS.NEW_COMMS.LIST_TRANSPORTS, sessions],
    staleTime: 60 * 60 * 1000, // 1 hour
  });
  return query;
};

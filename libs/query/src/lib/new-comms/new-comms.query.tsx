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
  });

  return query?.data?.data;
};

export const useListSessionLogs = (sessionId: string, payload: any) => {
  const { newCommunicationService } = useNewCommunicationQuery();

  const query = useQuery({
    queryFn: () =>
      newCommunicationService.session.listBroadcasts(sessionId, payload),

    queryKey: ['TAGS.NEW_COMMS.LIST_TRANSPORTS', payload],
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
  });

  return mutation;
};

export const useSessionBroadCastCount = (sessions: string[]) => {
  const { newCommunicationService } = useNewCommunicationQuery();

  const query = useQuery({
    queryFn: () => newCommunicationService.session.broadcastCount({ sessions }),

    queryKey: [TAGS.NEW_COMMS.LIST_TRANSPORTS, sessions],
  });
  return query;
};

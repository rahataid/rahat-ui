import { useMutation, useQuery } from '@tanstack/react-query';
import { useNewCommunicationQuery } from './new-comms.provider';
import { TAGS } from '../../config';
import Swal from 'sweetalert2';
import { useTranslations } from 'next-intl';

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

    queryKey: ['TAGS.NEW_COMMS.LIST_TRANSPORTS', payload, sessionId],
    staleTime: 60 * 60 * 1000, // 1 hour
  });
  return query;
};

export const useSessionRetryFailed = () => {
  const { newCommunicationService, newQueryClient } =
    useNewCommunicationQuery();
  const t = useTranslations('AA_PROJECT');

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
      Swal.fire(t('RETRY_SUCCESSFUL'), '', 'success');
    },
    onError: (error: any) => {
      // This calls an external, third-party communication service
      // (@rumsan/connect), not one of our own backends -- there's no
      // `code` field to key on, so match the one known fixed message and
      // fall back to a generic translated error for anything else, rather
      // than always claiming "max retries reached" regardless of cause.
      const rawMessage: string | undefined = error?.response?.data?.message;
      if (rawMessage === 'Session is completed') {
        Swal.fire(
          t('MAXIMUM_RETRIES_REACHED'),
          t('NO_FURTHER_RETRIES_POSSIBLE'),
          'error',
        );
        return;
      }
      Swal.fire(t('RETRY_FAILED'), rawMessage || t('ERROR'), 'error');
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

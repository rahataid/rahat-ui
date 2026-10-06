import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Transport } from '@rumsan/connect/src/types';
import { useNewCommunicationQuery } from './new-comms.provider';
import { TAGS } from '../../config';
import Swal from 'sweetalert2';
import { useTranslations } from 'next-intl';

type RetryFailedPayload = {
  cuid: string;
  includeFailed?: boolean;
};

const normalizeTransportList = (value: unknown): Transport[] | undefined => {
  if (Array.isArray(value)) return value;
  if (
    value &&
    typeof value === 'object' &&
    Array.isArray((value as { data?: unknown }).data)
  ) {
    return (value as { data: Transport[] }).data;
  }
  return undefined;
};

export const useListAllTransports = () => {
  const { newCommunicationService } = useNewCommunicationQuery();

  const query = useQuery({
    queryFn: () => newCommunicationService.transport.list(),
    queryKey: [TAGS.NEW_COMMS.LIST_TRANSPORTS],
    staleTime: 6 * 60 * 60 * 1000, // 6 hours
  });

  return normalizeTransportList(query?.data?.data);
};

export const useListSessionLogs = (sessionId: string, payload: any) => {
  const { newCommunicationService } = useNewCommunicationQuery();
  const { perPage, ...rest } = payload ?? {};
  const params = { ...rest, ...(perPage ? { limit: perPage } : {}) };
  const query = useQuery({
    queryFn: () =>
      newCommunicationService.session.listBroadcasts(sessionId, params),

    queryKey: [TAGS.NEW_COMMS.LIST_SESSION_LOGS, params, sessionId],
    staleTime: 60 * 60 * 1000, // 1 hour
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data?.data?.length) return false;
      const hasActive = data.data.some(
        (p: any) =>
          p.status === 'SCHEDULED' ||
          p.status === 'PENDING' ||
          p.status === 'IN_PROGRESS',
      );
      return hasActive ? 3000 : false;
    },
    enabled: !!sessionId,
  });
  return query;
};

export const useSessionRetryFailed = () => {
  const { newCommunicationService, newQueryClient } =
    useNewCommunicationQuery();
  const rootQueryClient = useQueryClient();
  const t = useTranslations('AA_PROJECT');

  const mutation = useMutation({
    mutationFn: (payload: RetryFailedPayload) =>
      newCommunicationService.session.retryIncomplete(
        payload.cuid,
        payload.includeFailed,
      ),

    mutationKey: [TAGS.NEW_COMMS.RETRY_FAILED],
    onMutate: async (variables) => {
      const sessionId = variables.cuid;
      // 1. Cancel in-flight queries
      await rootQueryClient.cancelQueries({
        queryKey: [TAGS.NEW_COMMS.BROADCAST_COUNTS],
      });
      // 2. Snapshot previous values
      const previousCounts = rootQueryClient.getQueriesData({
        queryKey: [TAGS.NEW_COMMS.BROADCAST_COUNTS],
      });

      // 3. Optimistically update broadcast counts so status INSTANTLY transitions to IN_PROGRESS
      rootQueryClient.setQueriesData(
        { queryKey: [TAGS.NEW_COMMS.BROADCAST_COUNTS] },
        (old: any) => {
          if (!old?.data) return old;
          const currentFail = old.data.FAIL ?? 0;
          const currentPending = old.data.PENDING ?? 0;
          const currentScheduled = old.data.SCHEDULED ?? 0;
          return {
            ...old,
            data: {
              ...old.data,
              PENDING: currentPending + (currentFail > 0 ? currentFail : 1),
              SCHEDULED: currentScheduled,
              FAIL: 0,
            },
          };
        },
      );

      return { previousCounts };
    },
    onSuccess: (_, variables) => {
      const sessionId = variables.cuid;
      console.log('Retry success for:', sessionId);

      // Invalidate on both root query client and newQueryClient
      rootQueryClient.invalidateQueries({
        queryKey: [TAGS.NEW_COMMS.BROADCAST_COUNTS],
      });
      rootQueryClient.invalidateQueries({
        queryKey: [TAGS.NEW_COMMS.LIST_SESSION_LOGS],
      });
      rootQueryClient.invalidateQueries({
        queryKey: ['ms.communications.getAll'],
      });
      rootQueryClient.invalidateQueries({
        queryKey: ['ms.communications.getOne'],
      });

      newQueryClient?.invalidateQueries({
        queryKey: [TAGS.NEW_COMMS.BROADCAST_COUNTS],
      });
      newQueryClient?.invalidateQueries({
        queryKey: [TAGS.NEW_COMMS.LIST_SESSION_LOGS],
      });

      Swal.fire(t('RETRY_SUCCESSFUL'), '', 'success');
    },
    onError: (error: any, _, context: any) => {
      if (context?.previousCounts) {
        context.previousCounts.forEach(([queryKey, data]: [any, any]) => {
          rootQueryClient.setQueryData(queryKey, data);
        });
      }
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
    onSettled: () => {
      rootQueryClient.invalidateQueries({
        queryKey: [TAGS.NEW_COMMS.BROADCAST_COUNTS],
      });
      rootQueryClient.invalidateQueries({
        queryKey: [TAGS.NEW_COMMS.LIST_SESSION_LOGS],
      });
    },
  });

  return mutation;
};

export const broadcastCountsQueryOptions = (
  service: {
    session: {
      broadcastCount: (args: { sessions: string[] }) => Promise<any>;
    };
  },
  sessions: string[],
) => ({
  queryKey: [TAGS.NEW_COMMS.BROADCAST_COUNTS, sessions],
  queryFn: () => service.session.broadcastCount({ sessions }),
  enabled: Array.isArray(sessions) && sessions.length > 0,
  staleTime: 60 * 60 * 1000,
  refetchInterval: (query: any) => {
    const data = query.state.data;
    const hasActive = data?.data?.SCHEDULED || data?.data?.PENDING;
    return hasActive ? 3000 : false;
  },
});

export const useSessionBroadCastCount = (sessions: string[]) => {
  const { newCommunicationService } = useNewCommunicationQuery();

  const query = useQuery(
    broadcastCountsQueryOptions(newCommunicationService, sessions),
  );
  return query;
};

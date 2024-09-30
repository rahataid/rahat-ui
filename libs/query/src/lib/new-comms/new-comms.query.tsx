import { useQuery } from '@tanstack/react-query';
import { useNewCommunicationQuery } from './new-comms.provider';
import { TAGS } from '../../config';

export const useListAllTransports = () => {
  const { newCommunicationService } = useNewCommunicationQuery()

  const query = useQuery({
    queryFn: () => newCommunicationService.transport.list(),
    queryKey: [TAGS.NEW_COMMS.LIST_TRANSPORTS],
  })

  return query?.data?.data;
};


export const useListSessionLogs = (sessionId: string, payload: any) => {
  const { newCommunicationService } = useNewCommunicationQuery()

  const query = useQuery({
    queryFn: () => newCommunicationService.session.listBroadcasts(sessionId, {
      params: payload
    }),
    queryKey: [TAGS.NEW_COMMS.LIST_TRANSPORTS, payload],
  })

  return query
};


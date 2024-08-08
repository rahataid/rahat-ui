import { useQuery } from '@tanstack/react-query';
import { useNewCommunicationQuery } from './new-comms.provider';
import { TAGS } from '../../config';

export const useListTransport = () => {
  const { newCommunicationService } = useNewCommunicationQuery()
  return useQuery({
    queryFn: () => newCommunicationService.transport.list(),
    queryKey: [TAGS.NEW_COMMS.LIST_TRANSPORTS]
  })
};

import { useQuery } from '@tanstack/react-query';
import { TAGS } from '../../../../community-query/src/config';
import { useNewCommunicationQuery } from './new-comms.provider';

export const useListTransport = () => {
  const { newCommunicationService } = useNewCommunicationQuery()
  return useQuery({
    queryFn: () => newCommunicationService.transport.list(),
    queryKey: [TAGS.NEW_COMMS.LIST_TRANSPORT]
  })
};

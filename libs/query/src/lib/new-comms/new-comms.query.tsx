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

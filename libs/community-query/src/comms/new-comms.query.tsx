import { useQuery } from '@tanstack/react-query';
import { useNewCommunicationQuery } from './new-comms.provider';
import { TAGS } from '../config';

export const useListAllTransports = () => {
  const { newCommunicationService } = useNewCommunicationQuery();
  console.log('comms', newCommunicationService);
  const query = useQuery({
    queryFn: () => newCommunicationService.transport.list(),
    queryKey: [TAGS.COMMS_LIST_TRANSPORTS],
  });

  return query?.data?.data;
};

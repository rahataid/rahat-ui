import { useQuery } from '@tanstack/react-query';
import { TAGS } from '../config';
import { useCommunicationService } from './comms.helpers';

export const useListAllTransports = () => {
  const newCommunicationService = useCommunicationService();
  const query = useQuery({
    queryFn: () => newCommunicationService.transport.list(),
    queryKey: [TAGS.COMMS_LIST_TRANSPORTS],
  });

  return query;
};

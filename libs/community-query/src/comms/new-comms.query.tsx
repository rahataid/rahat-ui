import { useQuery } from '@tanstack/react-query';
import { TAGS } from '../config';
import { useSettingsStore } from '../settings/settings.store';
import { useCommunicationService } from './comms.helpers';

export const useListAllTransports = () => {
  const commsSettings = useSettingsStore((s) => s.commsSetting);

  const newCommunicationService = useCommunicationService(commsSettings);
  const query = useQuery({
    queryFn: async () => await newCommunicationService.transport.list(),
    queryKey: [TAGS.COMMS_LIST_TRANSPORTS],
  });

  return query?.data?.data;
};

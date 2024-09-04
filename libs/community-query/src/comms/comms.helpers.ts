import { usePagination } from '@rahat-ui/query';
import { getClient } from '@rumsan/connect/src/clients';
import { useCommunitySettingList } from '../settings/settings.query';

export function useCommunicationService() {
  const {
    pagination,

    filters,
  } = usePagination();

  filters['name'] = 'COMMUNICATION';
  const { data } = useCommunitySettingList({
    ...pagination,
    ...(filters as any),
  });

  const newCommunicationService = getClient({
    baseURL: data?.data?.[0]?.value['URL'],
  });
  newCommunicationService.setAppId(data?.data?.[0]?.value['APP_ID']);

  return newCommunicationService;
}

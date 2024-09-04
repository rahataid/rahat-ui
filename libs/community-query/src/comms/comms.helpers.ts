import { getClient } from '@rumsan/connect/src/clients';

export function useCommunicationService(commsSettings: any) {
  const newCommunicationService = getClient({
    baseURL: commsSettings['URL'],
  });
  newCommunicationService.setAppId(commsSettings['APP_ID']);

  return newCommunicationService;
}

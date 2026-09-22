import { getAppClient } from '@rahataid/community-tool-sdk/clients';
import { useQuery, useRSQuery } from '@rumsan/react-query';
import { useMutation, UseQueryResult } from '@tanstack/react-query';
import { FormattedResponse } from '@rumsan/sdk/utils';
import { TAGS } from '../config';

export const useUploadAudio = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const upload = getAppClient(rumsanService.client);
  return useMutation({
    mutationFn: (payload: any) =>
      upload.uploadCommsAudio(payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    mutationKey: [TAGS.GET_DASHBOARD],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [TAGS.GET_DASHBOARD],
      });
    },
  });
};

export const useAppVersion = (): UseQueryResult<
  FormattedResponse<{ version: string }>,
  Error
> => {
  const { queryClient, rumsanService } = useRSQuery();
  const appClient = getAppClient(rumsanService.client);
  return useQuery(
    {
      queryKey: [TAGS.GET_APP_VERSION],
      queryFn: () => appClient.getVersion(),
    },
    queryClient,
  );
};

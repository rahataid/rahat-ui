import { getAppClient } from '@rahataid/community-tool-sdk/clients';
import { useRSQuery } from '@rumsan/react-query';
import { useMutation } from '@tanstack/react-query';
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

import {
  getAppClient,
  getSourceClient,
} from '@rahataid/community-tool-sdk/clients';
import { useRSQuery } from '@rumsan/react-query';
import { UseQueryResult, useMutation, useQuery } from '@tanstack/react-query';
import { TAGS } from '../config';
import Swal from 'sweetalert2';

export const useFetchKoboSettings = (): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const myClient = getAppClient(rumsanService.client);
  return useQuery(
    {
      queryKey: [TAGS.LIST_KOBO_SETTINGS],
      queryFn: () => myClient.listKoboSettings(),
    },

    queryClient,
  );
};

export const useExistingFieldMappings = () => {
  const { rumsanService } = useRSQuery();
  const sourceClient = getSourceClient(rumsanService.client);
  return useMutation({
    mutationFn: (importId: string) => sourceClient.importIdMapping(importId),
  });
};

// CompressionStream.
const gzipJson = async (payload: any): Promise<Blob | null> => {
  if (typeof CompressionStream === 'undefined') return null;
  try {
    const stream = new Blob([JSON.stringify(payload)], {
      type: 'application/json',
    })
      .stream()
      .pipeThrough(new CompressionStream('gzip'));
    return await new Response(stream).blob();
  } catch (e) {
    return null;
  }
};

export const useCreateImportSource = () => {
  const { rumsanService } = useRSQuery();
  const myClient = getSourceClient(rumsanService.client);
  return useMutation({
    mutationFn: async (payload: any) => {
      const gzipped = await gzipJson(payload);
      if (!gzipped) return myClient.create(payload);
      return myClient.create(gzipped as any, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Encoding': 'gzip',
        },
      });
    },
    onSuccess: () => {},
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Something went wrong!';
      Swal.fire({
        icon: 'error',
        title: msg,
      });
    },
  });
};

export const useKobotoolData = () => {
  const { rumsanService } = useRSQuery();
  const myClient = getAppClient(rumsanService.client);
  return useMutation({
    mutationFn: (formName: string) => myClient.koboImportByForm(formName),
  });
};

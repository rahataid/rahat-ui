'use client';
import { getImportsClient } from '@rahataid/sdk/clients';
import { useRSQuery } from '@rumsan/react-query';
import { useAuthStore } from '@rumsan/react-query/auth';
import { Pagination } from '@rumsan/sdk/types';
import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { UUID } from 'crypto';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TAGS } from '../../config';

export const useListImports = (
  payload: Pagination & { [key: string]: string },
): UseQueryResult<any, Error> => {
  const { rumsanService, queryClient } = useRSQuery();
  const importsClient = getImportsClient(rumsanService.client);
  return useQuery(
    {
      queryKey: [TAGS.LIST_IMPORTS, payload],
      queryFn: () => importsClient.list(payload),
    },
    queryClient,
  );
};

export const useGetImport = (
  uuid: UUID,
): UseQueryResult<any, Error> => {
  const { rumsanService, queryClient } = useRSQuery();
  const importsClient = getImportsClient(rumsanService.client);
  return useQuery(
    {
      queryKey: [TAGS.GET_IMPORT, uuid],
      queryFn: () => importsClient.get(uuid),
      enabled: !!uuid,
    },
    queryClient,
  );
};

export const useGetImportFile = (
  uuid: UUID | undefined,
): UseQueryResult<string, Error> => {
  const { rumsanService, queryClient } = useRSQuery();
  return useQuery(
    {
      queryKey: [TAGS.GET_IMPORT_FILE, uuid],
      queryFn: async () => {
        const response = await rumsanService.client.get(
          `/imports/${uuid}/file`,
          { responseType: 'text' },
        );
        return response.data as string;
      },
      enabled: !!uuid,
    },
    queryClient,
  );
};

export const useStartImport = () => {
  const { rumsanService } = useRSQuery();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uuid: string) => {
      const response = await rumsanService.client.post(
        `/imports/${uuid}/start`,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TAGS.LIST_IMPORTS] });
    },
  });
};

export type ImportProgress = {
  total: number;
  processed: number;
  failed: number;
  duplicates: number;
  status: string;
};

export const useImportProgress = (uuid: string | undefined) => {
  const [progress, setProgress] = useState<ImportProgress | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const queryClient = useQueryClient();

  const startListening = useCallback(() => {
    if (!uuid) return;

    const token = useAuthStore.getState().token;
    const baseURL = process.env['NEXT_PUBLIC_API_HOST_URL'] + '/v1';
    const url = `${baseURL}/imports/${uuid}/progress`;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsListening(true);
    setError(null);

    const fetchSSE = async () => {
      try {
        const response = await fetch(url, {
          headers: {
            Accept: 'text/event-stream',
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`SSE connection failed: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error('No readable stream');

        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data:')) {
              try {
                const data = JSON.parse(line.slice(5).trim());
                setProgress(data);

                if (
                  data.status === 'IMPORTED' ||
                  data.status === 'FAILED'
                ) {
                  queryClient.invalidateQueries({
                    queryKey: [TAGS.LIST_IMPORTS],
                  });
                  queryClient.invalidateQueries({
                    queryKey: [TAGS.GET_IMPORT, uuid],
                  });
                  setIsListening(false);
                  reader.cancel();
                  return;
                }
              } catch {
                // skip malformed JSON
              }
            }
          }
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setIsListening(false);
      }
    };

    fetchSSE();
  }, [uuid, queryClient]);

  const stopListening = useCallback(() => {
    abortRef.current?.abort();
    setIsListening(false);
  }, []);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  return { progress, isListening, error, startListening, stopListening };
};

export const useDownloadImportErrors = () => {
  const { rumsanService } = useRSQuery();

  return useCallback(
    async (uuid: string, groupName?: string) => {
      const response = await rumsanService.client.get(
        `/imports/${uuid}/errors`,
        { responseType: 'text' },
      );
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${groupName || 'import'}-errors.csv`;
      a.click();
      URL.revokeObjectURL(url);
    },
    [rumsanService],
  );
};

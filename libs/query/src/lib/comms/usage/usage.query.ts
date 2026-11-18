import axios from 'axios';
import { getCommsClient } from '@rahataid/sdk/clients';
import { useRSQuery } from '@rumsan/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { useSettingsStore } from '../../settings';
import { TAGS } from '../../../config';

type DateRangeQuery = { from?: string; to?: string };

export const useCommsTransports = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const commsClient = getCommsClient(rumsanService.client);

  return useQuery(
    {
      queryKey: [TAGS.COMMS_USAGE.LIST_TRANSPORTS],
      queryFn: () => commsClient.listTransports(),
      staleTime: 6 * 60 * 60 * 1000,
    },
    queryClient,
  );
};

export const useCommsUsage = (query?: DateRangeQuery) => {
  const { queryClient, rumsanService } = useRSQuery();
  const commsClient = getCommsClient(rumsanService.client);

  return useQuery(
    {
      queryKey: [TAGS.COMMS_USAGE.GET_USAGE, query],
      queryFn: () => commsClient.getUsage(query),
    },
    queryClient,
  );
};

export const useCommsUsageByXref = (
  xref: string,
  query?: DateRangeQuery,
) => {
  const { queryClient, rumsanService } = useRSQuery();
  const commsClient = getCommsClient(rumsanService.client);

  return useQuery(
    {
      queryKey: [TAGS.COMMS_USAGE.GET_USAGE_BY_XREF, xref, query],
      queryFn: () => commsClient.getUsageByXref(xref, query),
      enabled: !!xref,
    },
    queryClient,
  );
};

export const useCommsCredits = (query?: DateRangeQuery) => {
  const { queryClient, rumsanService } = useRSQuery();
  const commsClient = getCommsClient(rumsanService.client);

  return useQuery(
    {
      queryKey: [TAGS.COMMS_USAGE.GET_CREDITS, query],
      queryFn: () => commsClient.getCredits(query),
    },
    queryClient,
  );
};

export const useCommsCreditsByXref = (
  xref: string,
  query?: DateRangeQuery,
) => {
  const { queryClient, rumsanService } = useRSQuery();
  const commsClient = getCommsClient(rumsanService.client);

  return useQuery(
    {
      queryKey: [TAGS.COMMS_USAGE.GET_CREDITS_BY_XREF, xref, query],
      queryFn: () => commsClient.getCreditsByXref(xref, query),
      enabled: !!xref,
    },
    queryClient,
  );
};

export const useCommsUsageBackfill = () => {
  const qc = useQueryClient();
  const t = useTranslations('USAGE');
  const commsSettings = useSettingsStore((s) => s.commsSettings);

  return useMutation({
    mutationFn: async () => {
      const baseURL = commsSettings['URL'];
      const appId = commsSettings['APP_ID'];
      if (!baseURL || !appId) throw new Error('Communication settings not configured');
      const res = await axios.post(
        `${baseURL}/usage/backfill/${appId}`,
        null,
        {
          params: { batchSize: '100', concurrency: '5' },
          headers: { 'app-id': appId },
        },
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success(t('STATS_SYNCED_SUCCESSFULLY'));
    },
    onError: () => {
      toast.error(t('FAILED_TO_SYNC_STATS'));
    },
  });
};

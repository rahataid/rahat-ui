import { useRSQuery } from '@rumsan/react-query';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';

export const useGetDataSource = () => {
  const { rumsanService } = useRSQuery();

  return useQuery({
    queryKey: ['datasource'],
    queryFn: async () => {
      const res = await rumsanService.client.get(`/beneficiaries/statsSource`);
      return res.data.data;
    },
  });
};

export const useGetProjectDatasource = (projectUUID?: UUID) => {
  const { rumsanService } = useRSQuery();

  return useQuery({
    queryKey: ['datasource'],
    queryFn: async () => {
      const res = await rumsanService.client.get(
        `/projects/${projectUUID}/statsSources`,
      );
      return res.data.data;
    },
  });
};

export const useGetStatsCore = () => {
  const { rumsanService } = useRSQuery();

  return useQuery({
    queryKey: ['coreStats'],
    queryFn: async () => {
      const res = await rumsanService.client.get(`/beneficiaries/stats`);
      return res.data.data;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useSyncCoreStats = () => {
  const { rumsanService } = useRSQuery();
  const qc = useQueryClient();
  const t = useTranslations('AA_PROJECT');

  return useMutation({
    mutationFn: async () => {
      const res = await rumsanService.client.post(
        `/beneficiaries/stats/refresh`,
      );
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['coreStats'] });
      toast.success(t('STATS_DATA_SYNCED_SUCCESSFULLY'));
    },
    onError: () => {
      toast.error(t('FAILED_TO_SYNC_STATS_DATA'));
    },
  });
};

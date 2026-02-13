import { useRSQuery } from '@rumsan/react-query';
import { useQuery } from '@tanstack/react-query';
import { UUID } from 'crypto';

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

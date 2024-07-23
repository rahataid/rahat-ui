export const useGetDataSource = async (id: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST_URL}/v1/projects/${id}/statsSources`,
    );
    const res = await response.json();
    return res.data[0].data;
  };

import { useRSQuery } from '@rumsan/react-query';
import { useQuery } from '@tanstack/react-query';
import { UUID } from 'crypto';
export const useGetProjectDatasource = (projectUUID: UUID) => {
  const { rumsanService } = useRSQuery();

  return useQuery({
    queryKey: ['datasource'],
    queryFn: async () => {
      const res = await rumsanService.client.get(`/projects/${projectUUID}/statsSources`);
      return res.data.data;
    },
  });
};

import { useRSQuery } from '@rumsan/react-query';
import { useQuery } from '@tanstack/react-query';
import { UUID } from 'crypto';
export const useCommsBeneficiaryCount = (projectUUID: UUID) => {
  const data = `BENEFICIARY_TOTAL_ID_${projectUUID}`;
  const { rumsanService } = useRSQuery();

  return useQuery({
    queryKey: [data],
    queryFn: async () => {
      const res = await rumsanService.client.get(`/stats/${data}`);
      return res.data.data;
    },
  });
};

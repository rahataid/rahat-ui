import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { useRSQuery } from '@rumsan/react-query';
import { getVendorClient } from '@rahataid/sdk/clients';
import { useVendorStore } from './vendors.store';
import { TAGS } from '../../config';
import { useEffect } from 'react';

export const useVendorList = (payload: any): UseQueryResult<any, Error> => {
  const { rumsanService, queryClient } = useRSQuery();
  const vendorClient = getVendorClient(rumsanService.client);
  const { setVendors, setMeta } = useVendorStore((state) => ({
    setVendors: state.setVendors,
    setMeta: state.setMeta,
  }));

  const vendor = useQuery(
    {
      queryKey: [TAGS.GET_VENDORS, payload],
      select: (data) => {
        return {
          ...data,
          data: data.data.map((d: any) => ({
            id: d.User.uuid,
            status: d.User?.VendorProject[0]?.Project?.id
              ? 'Assigned'
              : 'Pending',
            email: d.User?.email,
            projectName: d.User?.VendorProject[0]?.Project?.name || 'N/A',
            walletAddress: d.User.wallet,
            name: d.User?.name,
            phone: d.User?.phone,
            gender: d.User?.gender,
          })),
        };
      },
      queryFn: () => vendorClient.list(payload),
    },
    queryClient,
  );

  useEffect(() => {
    if (vendor.data) {
      setVendors(vendor.data.data as any[]);
      setMeta(vendor.data.response.meta);
    }
  }, [vendor.data, setVendors]);

  return vendor;
};

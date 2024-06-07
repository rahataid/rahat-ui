'use client';
import {
  UseQueryResult,
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query';
import { useRSQuery } from '@rumsan/react-query';
import { getVendorClient } from '@rahataid/sdk/clients';
import { useVendorStore } from './vendors.store';
import { TAGS } from '../../config';
import { useEffect, useMemo } from 'react';
import { api } from '../../utils/api';


export const useVendorList = (payload: any): UseQueryResult<any, Error> => {
  const { rumsanService, queryClient } = useRSQuery();
  const vendorClient = getVendorClient(rumsanService.client);
  const { setVendors, setMeta } = useVendorStore((state) => ({
    setVendors: state.setVendors,
    setMeta: state.setMeta,
  }));

  const memoizedKey = useMemo(
    () => [TAGS.GET_VENDORS, payload.page, payload.perPage],
    [payload.page, payload.perPage],
  );

  const vendor = useQuery(
    {
      queryKey: memoizedKey,
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
      placeholderData: keepPreviousData,
    },
    queryClient,
  );

  useEffect(() => {
    if (vendor.isSuccess) {
      setVendors(vendor.data.data as any[]);
      setMeta(vendor.data.response.meta);
    }
  }, [vendor.isSuccess, setVendors]);

  return vendor;
};

const listBeneficiaryStats = async() =>{
  const response = await api.get('/vendors/stats');
  return response?.data
}

export const useGetVendorStats =(): UseQueryResult<any,Error> =>{
  return useQuery({
    queryKey:[TAGS.GET_VENDOr_STATS],
    queryFn: () => listBeneficiaryStats()
  })
}

'use client';
import {
  UseQueryResult,
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useRSQuery } from '@rumsan/react-query';
import { getVendorClient } from '@rahataid/sdk/clients';
import { useVendorStore } from './vendors.store';
import { TAGS } from '../../config';
import { useEffect, useMemo } from 'react';
import { api } from '../../utils/api';
import { UUID } from 'crypto';
import { useSwal } from '../../swal';

export const useVendorList = (
  payload: any,
  refetch: boolean,
): UseQueryResult<any, Error> => {
  const { rumsanService, queryClient } = useRSQuery();
  const vendorClient = getVendorClient(rumsanService.client);
  const { setVendors, setMeta } = useVendorStore((state) => ({
    setVendors: state.setVendors,
    setMeta: state.setMeta,
  }));

  const memoizedKey = useMemo(
    () => [TAGS.GET_VENDORS, payload.page, payload.perPage, refetch],
    [payload.page, payload.perPage, refetch],
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
            projectName:
              d.User?.VendorProject?.map((vp) => vp.Project?.name) || 'N/A',
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

const listBeneficiaryStats = async () => {
  const response = await api.get('/vendors/stats');
  return response?.data;
};

const getVendor = async (uuid: UUID) => {
  const response = await api.get(`/vendors/${uuid}`);
  return response?.data;
};

export const useGetVendor = (uuid: UUID): UseQueryResult<any, Error> => {
  const { queryClient } = useRSQuery();
  return useQuery(
    {
      queryKey: [TAGS.GET_VENDOR_DETAILS, uuid],
      // @ts-ignore
      queryFn: () => getVendor(uuid),
    },
    queryClient,
  );
};

export const useGetVendorStats = (): UseQueryResult<any, Error> => {
  return useQuery({
    queryKey: [TAGS.GET_VENDOr_STATS],
    queryFn: () => listBeneficiaryStats(),
  });
};

const updateVendor = async (uuid: UUID, payload: any) => {
  const response = await api.patch(`/vendors/update/${uuid}`, payload);
  return response?.data;
};

export const useUpdateVendor = () => {
  const qc = useQueryClient();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: ({ uuid, payload }: { uuid: UUID; payload: any }) =>
      updateVendor(uuid, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_VENDORS] });
      qc.invalidateQueries({ queryKey: [TAGS.GET_VENDOR_DETAILS] });
      toast.fire({
        title: 'Vendor updated successfully.',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      toast.fire({
        title: 'Error while updating vendor.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

const removeVendor = async ({
  vendorId,
  projectId,
}: {
  vendorId: UUID;
  projectId?: UUID;
}) => {
  const response = await api.patch(`/vendors/remove/${vendorId}`, {
    projectId,
  });
  return response?.data;
};

export const useRemoveVendor = () => {
  const qc = useQueryClient();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });

  return useMutation({
    mutationFn: ({
      vendorId,
      projectId,
    }: {
      vendorId: UUID;
      projectId?: UUID;
    }) => removeVendor({ vendorId, projectId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_VENDORS] });
      qc.invalidateQueries({ queryKey: [TAGS.GET_VENDOR_DETAILS] });
      toast.fire({
        title: 'Vendor removed successfully.',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      toast.fire({
        title: 'Error while removing vendor.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

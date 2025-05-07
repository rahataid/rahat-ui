import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { useSwal } from 'libs/query/src/swal';
import { useProjectAction } from '../../projects';

// Constants for actions
const GET_OFFLINE_BENEFICIARIES = 'rpProject.getOfflineBeneficiaries';
const GET_OFFLINE_VENDORS = 'rpProject.getOfflineVendors';
const GET_OFFLINE_SINGLE_VENDOR = 'rpProject.getOfflineSingleVendor';
const SYNC_OFFLINE_BENEFICIARIES = 'rpProject.syncOfflineBeneficiaries';
const GET_BENEFICIARIES_DISBURSEMENTS =
  'rpProject.beneficiaries.getDisbursements';

// hooks to get offline beneficiaries
export const useGetOfflineBeneficiaries = (
  projectUUID: UUID,
  vendorId?: number,
) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['rpGetOfflineBeneficiaries'],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: GET_OFFLINE_BENEFICIARIES,
          payload: { vendorId },
        },
      });
      return res.data;
    },
  });
};

export const useGetBeneficiariesDisbursements = (
  projectUUID: UUID,
  groupIds: string[],
) => {
  const action = useProjectAction();
  return useQuery({
    queryKey: ['rpGetBeneficiariesDisbursements', groupIds],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: GET_BENEFICIARIES_DISBURSEMENTS,
          payload: { groupIds },
        },
      });
      return res.data;
    },
  });
};

export const useGetOfflineVendors = (projectUUID: UUID, vendorId?: number) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['rpGetOfflineVendors'],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: GET_OFFLINE_VENDORS,
          payload: {},
        },
      });
      return res.data;
    },
  });
};

export const useGetOfflineSingleVendor = (
  projectUUID: UUID,
  vendorId: number,
) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['rpSingleOfflineVendor'],
    queryFn: async () => {
      try {
        const res = await action.mutateAsync({
          uuid: projectUUID,
          data: {
            action: GET_OFFLINE_SINGLE_VENDOR,
            payload: { vendorId },
          },
        });
        return res?.data;
      } catch (e) {
        return e;
      }
    },
  });
};

export const useVendorBeneficiary = (projectUUID: UUID, vendorId: number) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['rpProject.getBeneficiaryRedemption'],
    queryFn: async () => {
      try {
        const res = await action.mutateAsync({
          uuid: projectUUID,
          data: {
            action: 'rpProject.getBeneficiaryRedemption',
            payload: { vendorId },
          },
        });
        return res?.data;
      } catch (e) {
        return e;
      }
    },
  });
};

export const useSyncOfflineBeneficiaries = (projectUUID: UUID) => {
  const action = useProjectAction();

  return useMutation({
    mutationFn: async (data: any) => {
      try {
        const res = await action?.mutateAsync({
          uuid: projectUUID,
          data: {
            action: SYNC_OFFLINE_BENEFICIARIES,
            payload: data,
          },
        });
        return res?.data;
      } catch (e) {
        return e;
      }
    },
  });
};

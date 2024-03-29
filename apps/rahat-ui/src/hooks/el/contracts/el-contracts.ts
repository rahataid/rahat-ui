import { useSwal } from '../../../components/swal';
import {
  useWriteRahatDonorMintTokenAndApprove,
  useWriteRahatDonorMintTokenAndApproveDescription,
} from './donor';
import {
  useWriteElProjectAddBeneficiary,
  useWriteElProjectAssignClaims,
  useWriteElProjectCloseProject,
  useWriteElProjectUpdateVendor,
} from './elProject';

import { useProjectAction } from 'libs/query/src/lib/projects/projects';
import { MS_ACTIONS } from '@rahataid/sdk';

export const useAddBeneficiary = () => {
  const alert = useSwal();
  return useWriteElProjectAddBeneficiary({
    mutation: {
      onSuccess: () => {
        alert({
          title: 'Beneficiary added successfully',
          icon: 'success',
        });
      },
    },
  });
};

export const useAssignClaims = () => {
  const alert = useSwal();
  return useWriteElProjectAssignClaims({
    mutation: {
      onSuccess: () => {
        alert.fire({
          title: 'Voucher Assigned Successfully',
          icon: 'success',
        });
      },
      onError: (err) => {
        alert.fire({
          title: 'Error while assigning calims to beneficiaries',
          icon: 'error',
          text: err.message,
        });
      },
    },
  });
};

export const useMintVouchers = () => {
  const alert = useSwal();
  const toastMixin = alert.mixin({
    toast: true,
    icon: 'success',
    title: 'General Title',
    animation: false,
    position: 'top-right',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', alert.stopTimer);
      toast.addEventListener('mouseleave', alert.resumeTimer);
    },
  });
  return useWriteRahatDonorMintTokenAndApproveDescription({
    mutation: {
      onSuccess: () => {
        toastMixin.fire('It has been done');
      },
      onError: (err) => {
        alert.fire({
          title: 'Error while minting vouchers',
          icon: 'error',
          text: err.message,
        });
      },
    },
  });
};

export const useOnlyMintVoucher = () => {
  const alert = useSwal();
  const toastMixin = alert.mixin({
    toast: true,
    icon: 'success',
    title: 'General Title',
    animation: false,
    position: 'top-right',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', alert.stopTimer);
      toast.addEventListener('mouseleave', alert.resumeTimer);
    },
  });
  return useWriteRahatDonorMintTokenAndApprove({
    mutation: {
      onSuccess: () => {
        toastMixin.fire('It has been done');
      },
      onError: (err) => {
        alert.fire({
          title: 'Error while minting vouchers',
          icon: 'error',
          text: err.message,
        });
      },
    },
  });
};

export const useAddVendors = () => {
  const alert = useSwal();
  const addVendor = useProjectAction();
  return useWriteElProjectUpdateVendor({
    mutation: {
      onSuccess: async () => {
        alert.fire({
          title: 'Vendor approved sucessfully',
          icon: 'success',
        });
      },
      onError: (err) => {
        console.log('Err==>', err);
        alert.fire({
          title: 'Failed to approve vendor!',
          icon: 'error',
        });
      },
    },
  });
};

export const useCloseProject = () => {
  const alert = useSwal();
  return useWriteElProjectCloseProject({
    mutation: {
      onSuccess: () => {
        alert.fire({
          title: 'Project closed successfully',
          icon: 'success',
        });
      },
      onError: (err) => {
        alert.fire({
          title: 'Error closing Project',
          icon: 'error',
        });
      },
    },
  });
};

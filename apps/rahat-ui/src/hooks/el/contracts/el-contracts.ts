import { useSwal } from '../../../components/swal';
import {
  useSimulateRahatDonorMintTokenAndApprove,
  useWriteRahatDonorMintTokenAndApprove,
} from './donor';
import {
  useWriteElProjectAddBeneficiary,
  useWriteElProjectAssignClaims,
} from './elProject';

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
          title: 'Beneficiary Assigned Claims Successfully',
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

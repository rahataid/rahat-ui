import { useSwal } from '../../../components/swal';
import { useWriteRahatDonorMintTokenAndApprove } from './donor';
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
  return useWriteRahatDonorMintTokenAndApprove({
    mutation: {
      onSuccess: () => {
        alert.fire({
          title: 'Voucher Minted',
          icon: 'success',
        });
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

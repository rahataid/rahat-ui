import { useSwal } from '../components/swal';
import { useWriteElProjectAddBeneficiary, useWriteElProjectAssignClaims } from './generated';

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

export const useAssignClaims =() =>{
  const alert = useSwal();
  return useWriteElProjectAssignClaims({
    mutation:{
      onSuccess: () =>{
        alert.fire({
          title:'Beneficiary Assigned Claims Successfully',
          icon:'success',
        })
      },
      onError: (err) =>{
        alert.fire({
          title:'Error while assigning calims to beneficiaries',
          icon:'error',
          text:err.message
    
        })
      }
    }
  })
}


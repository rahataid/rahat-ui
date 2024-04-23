import { useMutation, useProjectAction } from '@rahat-ui/query';
import { useSwal } from '../../../components/swal';
import {
  useWriteRahatDonorMintTokenAndApprove,
  useWriteRahatDonorMintTokenAndApproveDescription,
} from './donor';
import {
  elProjectAbi,
  useWriteElProjectAddBeneficiary,
  useWriteElProjectAssignClaims,
  useWriteElProjectCloseProject,
  useWriteElProjectMulticall,
  useWriteElProjectUpdateVendor,
} from './elProject';

import { encodeFunctionData } from 'viem';
import { useWriteAccessManagerUpdateAdmin, useWriteAccessManagerUpdateProjectManager } from './access';
import { useUserCreate } from '@rumsan/react-query';
import { User } from '@rumsan/sdk/types';

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

export const useBulkAssignVoucher = () => {
  const multi = useWriteElProjectMulticall();
  const alert = useSwal();

  const multicall = useMutation({
    mutationFn: ({
      addresses,
      noOfTokens,
      contractAddress,
    }: {
      addresses: `0x${string}`[];
      noOfTokens: number;
      contractAddress: `0x${string}`;
    }): Promise<unknown> => {
      const encoded = addresses.map((address) => {
        return encodeFunctionData({
          abi: elProjectAbi,
          functionName: 'assignClaims',
          args: [address],
        });
      });
      return multi.writeContractAsync({
        args: [encoded],
        address: contractAddress,
      });
    },
    onSuccess: (data) => {
      alert.fire({
        title: 'Vouchers assigned successfully',
        icon: 'success',
      });
    },
    onError(error, variables, context) {
      alert.fire({
        title: 'Error while assigning vouchers',
        icon: 'error',
      });
    },
  });
  return multicall;
};

export const useAddManager = () =>{

  const contract = useWriteAccessManagerUpdateProjectManager();
  const addUser = useUserCreate()
  const alert = useSwal();

  const functionCall = useMutation({mutationFn:({
    data,
    walletAddress,
    contractAddress,
  }:{
    data:User,
    walletAddress:`0x${string}`,
    contractAddress: `0x${string}`
  }):Promise<unknown> =>{
    console.log({walletAddress,contractAddress})
    return contract.writeContractAsync({
      args:[walletAddress,true],
      address:contractAddress
    });
  },
  onSuccess:(result,variables) =>{
    console.log(variables)
    addUser.mutateAsync(variables.data)
  },
  onError:(err) =>{
    alert.fire({
      title: 'Error to add  user',
      icon: 'error',
    });
  }

})
return functionCall;
}


export const useAddAdmin = () =>{
  const contract = useWriteAccessManagerUpdateAdmin();
  const addUser = useUserCreate()
  const alert = useSwal();

  const functionCall = useMutation({mutationFn:({
    data,
    walletAddress,
    contractAddress,
  }:{
    data:User,
    walletAddress:`0x${string}`,
    contractAddress: `0x${string}`
  }):Promise<unknown> =>{
    return contract.writeContractAsync({
      args:[walletAddress,true],
      address:contractAddress
    });
  },
  onSuccess:(data,variables) =>{
    addUser.mutateAsync(variables.data)

  },
  onError:(err) =>{
    alert.fire({
      title: 'Error add Project',
      icon: 'error',
    });
  }
  
})
return functionCall;
}


export const useAddManagerRole = () =>{

  const contract = useWriteAccessManagerUpdateProjectManager();
  const addUser = useUserCreate()
  const alert = useSwal();

  const functionCall = useMutation({mutationFn:({
    data,
    walletAddress,
    contractAddress,
  }:{
    data:User,
    walletAddress:`0x${string}`,
    contractAddress: `0x${string}`
  }):Promise<unknown> =>{
    console.log({walletAddress,contractAddress})
    return contract.writeContractAsync({
      args:[walletAddress,true],
      address:contractAddress
    });
  },
  onSuccess:(result,variables) =>{
    console.log(variables)
    addUser.mutateAsync(variables.data)
  },
  onError:(err) =>{
    alert.fire({
      title: 'Error to add  user',
      icon: 'error',
    });
  }

})
return functionCall;
}


export const useAddAdminRole = () =>{
  const contract = useWriteAccessManagerUpdateAdmin();
  const addUser = useUserCreate()
  const alert = useSwal();

  const functionCall = useMutation({mutationFn:({
    data,
    walletAddress,
    contractAddress,
  }:{
    data:User,
    walletAddress:`0x${string}`,
    contractAddress: `0x${string}`
  }):Promise<unknown> =>{
    return contract.writeContractAsync({
      args:[walletAddress,true],
      address:contractAddress
    });
  },
  onSuccess:(data,variables) =>{
    addUser.mutateAsync(variables.data)

  },
  onError:(err) =>{
    alert.fire({
      title: 'Error add Project',
      icon: 'error',
    });
  }
  
})
return functionCall;
}

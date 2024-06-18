import { useMutation } from '@rahat-ui/query';
import { useAlert } from '../../../components/swal';
import {
  useWriteRahatDonorMintTokenAndApprove,
  useWriteRahatDonorMintTokenAndApproveDescription,
} from './donor';
import {
  elProjectAbi,
  useReadElProjectGetProjectVoucherDetail,
  useWriteElProjectAddBeneficiary,
  useWriteElProjectAssignClaims,
  useWriteElProjectCloseProject,
  useWriteElProjectMulticall,
  useWriteElProjectUpdateVendor,
} from './elProject';

import { encodeFunctionData } from 'viem';
import {
  useWriteAccessManagerUpdateAdmin,
  useWriteAccessManagerUpdateProjectManager,
} from './access';
import { useUserAddRoles } from '@rumsan/react-query';
import { useUserCreate } from '@rahat-ui/query';
import { User } from '@rumsan/sdk/types';
import { UUID } from 'crypto';
import { useRouter } from 'next/navigation';

export const useAddBeneficiary = () => {
  const alert = useAlert();
  const route = useRouter();
  return useWriteElProjectAddBeneficiary({
    mutation: {
      onSuccess: () => {
        alert.fire({
          title: 'Beneficiary added successfully',
          icon: 'success',
        });
      },
    },
  });
};

export const useAssignClaims = () => {
  const alert = useAlert();
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
  const toastMixin = useAlert();
  const route = useRouter();
  const contract = useWriteRahatDonorMintTokenAndApproveDescription();

  const functionCall = useMutation({
    mutationFn: ({
      id,
      args,
      contractAddress,
    }: {
      id: string;
      args: any;
      contractAddress: `0x${string}`;
    }): Promise<unknown> => {
      return contract.writeContractAsync({
        args: args,
        address: contractAddress,
      });
    },
    onSuccess: async (result, variables) => {
      toastMixin.fire('Voucher Minted Successfully');
        route.push(`/projects/el/${variables.id}`);
    },
    onError: (err) => {
      toastMixin.fire({
        title: 'Error ',
        icon: 'error',
        text: 'Error while minting vouchers',
      });
    },
  });
  return functionCall
  // return useWriteRahatDonorMintTokenAndApproveDescription({
  //   mutation: {

  //     onSuccess: () => {
  //       toastMixin.fire('It has been done');
  //       route.push(`/projects/}`);
  //     },
  //     onError: (err) => {
  //       toastMixin.fire({
  //         title: 'Error while minting vouchers',
  //         icon: 'error',
  //         text: err.message,
  //       });
  //     },
  //   },
  // });
};

export const useOnlyMintVoucher = () => {
  const toastMixin = useAlert();
  return useWriteRahatDonorMintTokenAndApprove({
    mutation: {
      onSuccess: () => {
        toastMixin.fire({
          title: 'Success',
          text: 'Voucher minted successfully',
        });
      },
      onError: (err) => {
        toastMixin.fire({
          title: 'Error',
          icon: 'error',
          text: 'Error while minting voucher',
        });
      },
    },
  });
};

export const useAddVendors = () => {
  const alert = useAlert();
  return useWriteElProjectUpdateVendor({
    mutation: {
      onSuccess: async () => {
        alert.fire({
          title: 'Vendor approved sucessfully',
          icon: 'success',
        });
      },
      onError: (err) => {
        alert.fire({
          title: 'Failed to approve vendor!',
          icon: 'error',
        });
      },
    },
  });
};

export const useCloseProject = () => {
  const alert = useAlert();
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
  const alert = useAlert();

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

export const useAddManager = () => {
  const contract = useWriteAccessManagerUpdateProjectManager();
  const addUser = useUserCreate();
  const alert = useAlert();

  const functionCall = useMutation({
    mutationFn: ({
      data,
      walletAddress,
      contractAddress,
    }: {
      data: User;
      walletAddress: `0x${string}`;
      contractAddress: `0x${string}`;
    }): Promise<unknown> => {
      return contract.writeContractAsync({
        args: [walletAddress, true],
        address: contractAddress,
      });
    },
    onSuccess: async (result, variables) => {
      await addUser.mutateAsync(variables.data);
      route.push('/users');
    },
    onError: (err) => {
      alert.fire({
        title: 'Error adding manager',
        text: err.message,
        icon: 'error',
      });
    },
  });
  return functionCall;
};

export const useAddAdmin = () => {
  const contract = useWriteAccessManagerUpdateAdmin();
  const addUser = useUserCreate();
  const alert = useAlert();
  const route = useRouter();

  const functionCall = useMutation({
    mutationFn: ({
      data,
      walletAddress,
      contractAddress,
    }: {
      data: User;
      walletAddress: `0x${string}`;
      contractAddress: `0x${string}`;
    }): Promise<unknown> => {
      return contract.writeContractAsync({
        args: [walletAddress, true],
        address: contractAddress,
      });
    },
    onSuccess: async (data, variables) => {
      await addUser.mutateAsync(variables.data);
      route.push('/users');
    },
    onError: (err) => {
      alert.fire({
        title: 'Error adding admin',
        text: err.message,
        icon: 'error',
      });
    },
  });
  return functionCall;
};

export const useAddManagerRole = () => {
  const contract = useWriteAccessManagerUpdateProjectManager();
  const addUserRole = useUserAddRoles();
  const alert = useAlert();

  const functionCall = useMutation({
    mutationFn: ({
      data,
      contractAddress,
    }: {
      data: { role: string; uuid: UUID; wallet: `0X${string}` };
      contractAddress: `0x${string}`;
    }): Promise<unknown> => {
      return contract.writeContractAsync({
        args: [data.wallet, true],
        address: contractAddress,
      });
    },
    onSuccess: async (result, variables) => {
      await addUserRole.mutateAsync({
        uuid: variables.data.uuid,
        roles: [variables.data.role],
      });
    },
    onError: (err) => {
      alert.fire({
        title: 'Error adding roles',
        text: err.message,
        icon: 'error',
      });
    },
  });
  return functionCall;
};

export const useAddAdminRole = () => {
  const contract = useWriteAccessManagerUpdateAdmin();
  const addUserRole = useUserAddRoles();
  const alert = useAlert();

  const functionCall = useMutation({
    mutationFn: ({
      data,
      contractAddress,
    }: {
      data: { role: string; uuid: UUID; wallet: `0X${string}` };
      contractAddress: `0x${string}`;
    }): Promise<unknown> => {
      return contract.writeContractAsync({
        args: [data.wallet, true],
        address: contractAddress,
      });
    },
    onSuccess: async (data, variables) => {
      await addUserRole.mutateAsync({
        uuid: variables.data.uuid,
        roles: [variables.data.role],
      });
    },
    onError: (err) => {
      alert.fire({
        title: 'Error adding roles',
        text: err.message,
        icon: 'error',
      });
    },
  });
  return functionCall;
};

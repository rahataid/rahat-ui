import Swal from 'sweetalert2';
import { useWriteRahatDonorMintTokenAndSend } from '../generated-hooks/rahatDonor';
import { useRSQuery } from '@rumsan/react-query';
import { useMutation } from '@tanstack/react-query';
import { encodeFunctionData, parseEther } from 'viem';
import {
  cvaProjectAbi,
  useWriteCvaProjectAssignClaims,
  useWriteCvaProjectMulticall,
} from '../generated-hooks/cvaProject';

export const useTokenMintAndSend = () => {
  const { queryClient } = useRSQuery();
  const donorMintTokenAndSend = useWriteRahatDonorMintTokenAndSend();
  const alert = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });

  return useMutation(
    {
      onSettled(data, error, variables, context) {
        console.log('data', data);
        console.log('error', error);
        console.log('variables', variables, context);
      },
      onSuccess: () => {
        alert.fire({
          icon: 'success',
          title: 'Token minted and approved successfully',
        });
      },
      onError: (error) => {
        console.log('error', error);
        alert.fire({
          icon: 'error',
          title: 'Error minting and approving token',
          text: error.message,
        });
      },
      mutationFn: async ({
        amount,
        tokenAddress,
        projectAddress,
        rahatDonorAddress,
      }: {
        tokenAddress: `0x{string}`;
        projectAddress: `0x{string}`;
        amount: string;
        rahatDonorAddress: `0x{string}`;
      }) => {
        return donorMintTokenAndSend.writeContractAsync({
          args: [tokenAddress, projectAddress, parseEther(amount)],
          address: rahatDonorAddress,
        });
      },
    },
    queryClient,
  );
};

export const useAssignClaimsToBeneficiary = () => {
  const { queryClient } = useRSQuery();
  const assignClaims = useWriteCvaProjectAssignClaims();
  const alert = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-secondary',
    },
    buttonsStyling: false,
  });

  return useMutation(
    {
      onSuccess: () => {
        alert.fire({
          icon: 'success',
          title: 'Claims assigned successfully',
        });
      },
      onError: (error) => {
        alert.fire({
          icon: 'error',
          title: 'Error assigning claims',
          text: error.message,
        });
      },
      mutationFn: async ({
        projectAddress,
        beneficiary,
        tokenAmount,
      }: {
        tokenAmount: string;
        beneficiary: `0x{string}`;
        projectAddress: `0x{string}`;
      }) => {
        return assignClaims.writeContractAsync({
          args: [beneficiary, parseEther(tokenAmount)],
          address: projectAddress,
        });
      },
    },
    queryClient,
  );
};

export const useBulkAssignClaimsToBeneficiaries = () => {
  const multi = useWriteCvaProjectMulticall();
  const { queryClient } = useRSQuery();

  const alert = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-secondary',
    },
    buttonsStyling: false,
  });

  return useMutation(
    {
      onError: (error) => {
        alert.fire({
          icon: 'error',
          title: 'Error assigning claims',
          text: error.message,
        });
      },
      onSuccess: (d, { projectAddress }) => {
        alert.fire({
          icon: 'success',
          title: 'Claims assigned successfully',
        });
        // queryClient.invalidateQueries({
        //   queryKey: ['ProjectDetails', projectAddress],
        // });
        // console.log('success', d);
      },
      mutationFn: async ({
        beneficiaryAddresses,
        tokenAmount,
        projectAddress,
      }: {
        beneficiaryAddresses: `0x${string}`[];
        tokenAmount: string;
        projectAddress: `0x${string}`;
      }) => {
        const encodeAssignClaimsToBeneficiary = beneficiaryAddresses.map(
          (beneficiary) => {
            return encodeFunctionData({
              abi: cvaProjectAbi,
              functionName: 'assignClaims',
              args: [beneficiary, parseEther(tokenAmount)],
            });
          },
        );

        await multi.writeContractAsync({
          args: [encodeAssignClaimsToBeneficiary],
          address: projectAddress,
        });
      },
    },
    queryClient,
  );
};

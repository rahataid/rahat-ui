'use client';
import { useRSQuery } from '@rumsan/react-query';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { encodeFunctionData, formatUnits } from 'viem';
import {
  rahatPayrollProjectAbi,
  useReadRahatPayrollProjectTotalAllocated,
  useReadRahatTokenDecimals,
  useWriteRahatPayrollProjectMulticall,
  useWriteRahatTreasuryCreateToken,
  useWriteRahatTreasuryTransferToken,
} from '../generated-hooks';
import { useRouter } from 'next/navigation';
import { useWriteRedemptionsRedeemToken } from '../generated-hooks/redemptions';
import { UUID } from 'crypto';
import { useRedeemToken } from '../../project-actions';

export const useTokenCreate = () => {
  const { queryClient } = useRSQuery();
  const treasuryCreateToken = useWriteRahatTreasuryCreateToken();

  const alert = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });

  return useMutation(
    {
      onSuccess: async () => {
        alert.fire({
          icon: 'success',
          title: 'Token Created Successfully',
        });
      },

      onError: (error) => {
        console.log('error', error.message);
        alert.fire({
          icon: 'error',
          title: 'Error minting and approving token',
          text: 'Error Creating Token',
        });
      },

      mutationFn: async ({
        name,
        symbol,
        description,
        decimals,
        manager,
        rahatTreasuryAddress,
        initialSupply,
      }: {
        name: string;
        symbol: string;
        description: string;
        decimals: number;
        manager: `0x${string}`;
        rahatTreasuryAddress: `0x${string}`;
        initialSupply: string;
      }) => {
        const value = await treasuryCreateToken.writeContractAsync({
          args: [
            name,
            symbol,
            description,
            decimals,
            BigInt(initialSupply),
            rahatTreasuryAddress,
            manager,
          ],
          address: rahatTreasuryAddress,
        });

        return value;
      },
    },
    queryClient,
  );
};

// export const useBulkAssignClaimsToBeneficiaries = () => {
//   const multi = useWriteCvaProjectMulticall();
//   const { queryClient } = useRSQuery();

//   const alert = Swal.mixin({
//     customClass: {
//       confirmButton: 'btn btn-primary',
//       cancelButton: 'btn btn-secondary',
//     },
//     buttonsStyling: false,
//   });

//   return useMutation(
//     {
//       onError: (error) => {
//         alert.fire({
//           icon: 'error',
//           title: 'Error assigning claims',
//           text: error.message,
//         });
//       },
//       onSuccess: (d, { projectAddress }) => {
//         alert.fire({
//           icon: 'success',
//           title: 'Claims assigned successfully',
//         });
//         // queryClient.invalidateQueries({
//         //   queryKey: ['ProjectDetails', projectAddress],
//         // });
//         // console.log('success', d);
//       },
//       mutationFn: async ({
//         beneficiaryAddresses,
//         tokenAmount,
//         projectAddress,
//       }: {
//         beneficiaryAddresses: `0x${string}`[];
//         tokenAmount: string;
//         projectAddress: `0x${string}`;
//       }) => {
//         const encodeAssignClaimsToBeneficiary = beneficiaryAddresses.map(
//           (beneficiary) => {
//             return encodeFunctionData({
//               abi: cvaProjectAbi,
//               functionName: 'assignClaims',
//               args: [beneficiary, parseEther(tokenAmount)],
//             });
//           },
//         );

//         await multi.writeContractAsync({
//           args: [encodeAssignClaimsToBeneficiary],
//           address: projectAddress,
//         });
//       },
//     },
//     queryClient,
//   );
// };

export const useBulkAllocateTokens = (tokenAddress: any) => {
  const multi = useWriteRahatPayrollProjectMulticall();
  const { queryClient } = useRSQuery();
  const decimals = useReadRahatTokenDecimals({
    address: tokenAddress,
    query: {
      enabled: !!tokenAddress,
    },
  });

  console.log('decimals', decimals);

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
          title: 'Error allocating tokens',
          text: error.message,
        });
      },
      onSuccess: (d, { projectAddress }) => {
        alert.fire({
          icon: 'success',
          title: 'Tokens allocated successfully',
        });
        // queryClient.invalidateQueries({
        //   queryKey: ['ProjectDetails', projectAddress],
        // });
        // console.log('success', d);
      },
      mutationFn: async ({
        beneficiaryAddresses,
        tokenAddress,
        projectAddress,
      }: {
        beneficiaryAddresses: {
          walletAddress: `0x${string}`;
          amount: number;
        }[];
        amount?: string;
        tokenAddress: `0x${string}`;
        projectAddress: `0x${string}`;
      }) => {
        console.log('first', {
          beneficiaryAddresses,
          tokenAddress,
          projectAddress,
        });
        const encodeAllocateTokens = beneficiaryAddresses.map((beneficiary) => {
          return encodeFunctionData({
            abi: rahatPayrollProjectAbi,
            functionName: 'allocateToken',
            args: [
              tokenAddress,
              beneficiary.walletAddress,
              // @ts-ignore
              formatUnits(
                BigInt(beneficiary.amount.toString()), // Convert to bigint using BigInt function
                decimals.data as number,
              ),
              // parseEther(beneficiary.amount.toString()),
            ],
          });
        });

        await multi.writeContractAsync({
          args: [encodeAllocateTokens],
          address: projectAddress,
        });
      },
    },
    queryClient,
  );
};

export const useGetTokenAllocations = (
  projectAddress: `0x${string}`,
  tokenAddress: `0x${string}`,
) => {
  const decimals = useReadRahatTokenDecimals({
    query: {
      enabled: !!tokenAddress,
    },
    address: tokenAddress,
  });
  console.log('decimals.', decimals.data);
  return useReadRahatPayrollProjectTotalAllocated({
    address: projectAddress,
    query: {
      enabled: !!projectAddress,
      select(data) {
        console.log('data', data);
        return data ? formatUnits(data, decimals.data as number) : 0;
      },
    },
  });
};

export const useSendFundToProject = () => {
  const sendFundProject = useWriteRahatTreasuryTransferToken();

  const { queryClient } = useRSQuery();
  // const decimals = useReadRahatTokenDecimals({
  //   address: tokenAddress,
  // });
  const router = useRouter();

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
          title: 'Error sending funds',
          text: error.message,
        });
      },
      onSuccess: (d, { projectAddress }) => {
        alert.fire({
          icon: 'success',
          title: 'Funds sent successfully',
        });
        router.push('/treasury');

        // queryClient.invalidateQueries({
        //   queryKey: ['ProjectDetails', projectAddress],
        // });
        // console.log('success', d);
      },
      mutationFn: async ({
        amount,
        projectAddress,
        tokenAddress,
        treasuryAddress,
      }: {
        projectAddress: `0x${string}`;
        amount: string;
        tokenAddress: `0x${string}`;
        treasuryAddress: `0x${string}`;
      }) => {
        return sendFundProject.writeContractAsync({
          // @ts-ignore
          args: [tokenAddress, projectAddress, formatUnits(amount, 0)],
          address: treasuryAddress,
        });
      },
    },
    queryClient,
  );
};

export const useContractRedeem = (projectUUID: UUID) => {
  const redemptionContract = useWriteRedemptionsRedeemToken();

  const updateRedemption = useRedeemToken(projectUUID);
  const alert = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-secondary',
    },
    buttonsStyling: false,
  });

  return useMutation({
    onError: (error) => {
      alert.fire({
        icon: 'error',
        title: 'Error redeeming token',
        text: error.message,
      });
    },
    onSuccess: async (d, variables) => {
      await updateRedemption.mutateAsync({ uuid: variables?.uuid });
      alert.fire({
        icon: 'success',
        title: 'Voucher redeemed successfully',
      });
    },
    mutationFn: async ({
      amount,
      tokenAddress,
      redemptionAddress,
      senderAddress,
      uuid,
    }: {
      amount: number;
      tokenAddress: `0x${string}`;
      redemptionAddress: `0x${string}`;
      senderAddress: `0x${string}`;
      uuid: string;
    }) => {
      return redemptionContract.writeContractAsync({
        args: [tokenAddress, senderAddress, BigInt(amount)],
        address: redemptionAddress,
      });
    },
  });
};

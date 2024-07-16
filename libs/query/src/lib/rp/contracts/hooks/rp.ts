import { useRSQuery } from '@rumsan/react-query';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { formatUnits } from 'viem';
import {
  useReadRahatPayrollProjectTotalAllocated,
  useReadRahatTokenDecimals,
  useWriteRahatPayrollProjectAllocateToken,
  useWriteRahatPayrollProjectMulticall,
  useWriteRahatTreasuryCreateToken,
  useWriteRahatTreasuryTransferToken,
} from '../generated-hooks';

export const useTokenCreate = () => {
  const treasuryCreateToken = useWriteRahatTreasuryCreateToken();

  const alert = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });

  return useMutation({
    onSuccess: async () => {
      alert.fire({
        icon: 'success',
        title: 'Token Created Successfully',
      });
    },

    onError: (error) => {
      console.log('errwagor', error.message);
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
      rahatForwarderAddress,
    }: {
      name: string;
      symbol: string;
      description: string;
      decimals: number;
      manager: `0x${string}`;
      rahatTreasuryAddress: `0x${string}`;
      initialSupply: string;
      rahatForwarderAddress: `0x${string}`;
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
          rahatForwarderAddress,
        ],
        address: rahatTreasuryAddress,
      });
      return value;
    },
  });
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

//TODO: Bulk Allocate
export const useBulkAllocateTokens = (tokenAddress: any) => {
  const { queryClient } = useRSQuery();
  const allocateToken = useWriteRahatPayrollProjectAllocateToken();

  const decimals = useReadRahatTokenDecimals({
    address: tokenAddress,
  });

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
      },
      mutationFn: async ({
        beneficiary,
        tokenAddress,
        projectAddress,
        tokenAmount = '0',
      }: {
        beneficiary: `0x${string}`;
        tokenAddress: `0x${string}`;
        projectAddress: `0x${string}`;
        tokenAmount?: string;
      }) => {
        return allocateToken.writeContractAsync({
          args: [tokenAddress, beneficiary, BigInt(tokenAmount)],
          address: projectAddress,
        });
        // const encodeAllocateTokens = beneficiary.map((beneficiary) => {
        //   return encodeFunctionData({
        //     abi: rahatPayrollProjectAbi,
        //     functionName: 'allocateToken',
        //     args: [
        //       tokenAddress,
        //       beneficiary.walletAddress,
        //       // @ts-ignore
        //       formatUnits(
        //         BigInt(beneficiary.amount), // Convert to bigint using BigInt function
        //         (decimals.data as number) ?? 18,
        //       ),
        //       // parseEther(beneficiary.amount.toString()),
        //     ],
        //   });
        // });

        // console.log({ encodeAllocateTokens });

        // await multi.writeContractAsync({
        //   args: [encodeAllocateTokens],
        //   address: projectAddress,
        // });
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

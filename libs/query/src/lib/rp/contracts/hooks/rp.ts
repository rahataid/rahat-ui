import { useRSQuery } from '@rumsan/react-query';
import Swal from 'sweetalert2';
import { useMutation } from '@tanstack/react-query';
import {
  rahatPayrollProjectAbi,
  useReadRahatPayrollProjectTotalAllocated,
  useReadRahatTokenDecimals,
  useWriteRahatPayrollProjectMulticall,
  useWriteRahatTreasuryCreateToken,
} from '../generated-hooks';
import { encodeFunctionData, formatUnits } from 'viem';

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
      onSettled(data, error, variables, context) {
        console.log('data', data);
        console.log('error', error);
        console.log('variables', variables, context);
      },
      onSuccess: () => {
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
        return treasuryCreateToken.writeContractAsync({
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
        const encodeAllocateTokens = beneficiaryAddresses.map((beneficiary) => {
          return encodeFunctionData({
            abi: rahatPayrollProjectAbi,
            functionName: 'allocateToken',
            args: [
              tokenAddress,
              beneficiary.walletAddress,
              // @ts-ignore
              formatUnits(
                BigInt(beneficiary.amount), // Convert to bigint using BigInt function
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

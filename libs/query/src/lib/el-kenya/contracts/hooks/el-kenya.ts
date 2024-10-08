import { useRSQuery } from '@rumsan/react-query';
import Swal from 'sweetalert2';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { encodeFunctionData, formatUnits } from 'viem';
import { useReadRahatTokenDecimals } from '../generated-hooks/rahatToken';
import {
  useWriteRahatCvaKenyaMulticall,
  rahatCvaKenyaAbi,
  useWriteRahatTreasuryCreateToken,
  useReadRahatCvaKenyaTokenAllocations,
  useWriteRahatTreasuryTransferToken,
  useWriteRedemptionsRedeemToken,
} from '../generated-hooks';
import { useRouter } from 'next/navigation';
import { useProjectAction } from '../../../projects';
import { UUID } from 'crypto';
import { MS_ACTIONS } from '@rahataid/sdk';

const CREATE_BULK_DISBURSEMENT = 'rpProject.disbursement.bulkCreate';

export const useKenyaVoucherCreate = () => {
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

export const useBulkCreateKenyaDisbursement = (projectUUID: UUID) => {
  const action = useProjectAction(['createBulkDisbursement-rpProject']);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      amount: number;
      beneficiaries: { walletAddress: `0x${string}`; phone: string }[];
    }) => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: CREATE_BULK_DISBURSEMENT,
          payload: data,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [MS_ACTIONS.BENEFICIARY.LIST_BY_PROJECT, {}],
      });
      queryClient.invalidateQueries({
        queryKey: ['disbursements', projectUUID],
      });
    },
  });
};

export const useBulkAssignKenyaVoucher = (
  tokenAddress: any,
  projectId: UUID,
) => {
  console.log('tokenAddress', tokenAddress);
  const multi = useWriteRahatCvaKenyaMulticall();
  const { queryClient } = useRSQuery();
  const decimals = useReadRahatTokenDecimals({
    address: tokenAddress,
    query: {
      enabled: !!tokenAddress,
    },
  });

  const bulkAssignDisbursement = useBulkCreateKenyaDisbursement(projectId);

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
      onError: (error: any) => {
        alert.fire({
          icon: 'error',
          title: 'Error allocating tokens',
          text: error.message,
        });
      },
      onSuccess: async (data, variables, context) => {
        await bulkAssignDisbursement.mutateAsync({
          amount: 1,
          beneficiaries: variables.beneficiaryAddresses.map((b) => {
            return { walletAddress: b.walletAddress, phone: b.phone };
          }),
        });
        alert.fire({
          icon: 'success',
          title: 'Tokens allocated successfully',
        });
      },

      mutationFn: async ({
        beneficiaryAddresses,
        tokenAddress,
        projectAddress,
      }: {
        beneficiaryAddresses: {
          walletAddress: `0x${string}`;
          phone: string;
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
            abi: rahatCvaKenyaAbi,
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

export const useGetKenyaVoucherAllocations = (
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
  return useReadRahatCvaKenyaTokenAllocations({
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

export const useSendFundToKenyaProject = () => {
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

// export const useContractRedeem = (projectUUID: UUID) => {
//   const redemptionContract = useWriteRedemptionsRedeemToken();

//   const updateRedemption = useRedeemToken(projectUUID);
//   const alert = Swal.mixin({
//     customClass: {
//       confirmButton: 'btn btn-primary',
//       cancelButton: 'btn btn-secondary',
//     },
//     buttonsStyling: false,
//   });

//   return useMutation({
//     onError: (error) => {
//       alert.fire({
//         icon: 'error',
//         title: 'Error redeeming token',
//         text: error.message,
//       });
//     },
//     onSuccess: async (d, variables) => {
//       await updateRedemption.mutateAsync({ uuid: variables?.uuid });
//       alert.fire({
//         icon: 'success',
//         title: 'Token redeemed successfully',
//       });
//     },
//     mutationFn: async ({
//       amount,
//       tokenAddress,
//       redemptionAddress,
//       senderAddress,
//       uuid,
//     }: {
//       amount: number;
//       tokenAddress: `0x${string}`;
//       redemptionAddress: `0x${string}`;
//       senderAddress: `0x${string}`;
//       uuid: string;
//     }) => {
//       return redemptionContract.writeContractAsync({
//         args: [tokenAddress, senderAddress, BigInt(amount)],
//         address: redemptionAddress,
//       });
//     },
//   });
// };

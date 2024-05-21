import { useMutation } from '@tanstack/react-query';
import { encodeFunctionData, parseEther } from 'viem';
import {
  c2CProjectAbi,
  useWriteC2CProjectMulticall,
} from '../generated-hooks/c2c';
import { useRSQuery } from '@rumsan/react-query';

//Temporary solution, should be changed when crypto is implemented
export const useDepositTokenToProject = () => {
  //   const write = useWriteContract({
  //     config: {
  //   }
  // })
};

export const useDisburseTokenToBeneficiaries = () => {
  const multi = useWriteC2CProjectMulticall();
  const { queryClient } = useRSQuery();

  return useMutation(
    {
      onError: (error) => {
        console.error(error);
      },
      onSuccess: (d) => {
        console.log('success', d);
      },
      mutationFn: async ({
        amount,
        beneficiaryAddresses,
        rahatTokenAddress,
        c2cProjectAddress,
      }: {
        beneficiaryAddresses: `0x${string}`[];
        amount: string;
        rahatTokenAddress: `0x{string}`;
        c2cProjectAddress: `0x{string}`;
      }) => {
        const encodeAssignClaimsToBeneficiary = beneficiaryAddresses.map(
          (beneficiary) => {
            return encodeFunctionData({
              abi: c2CProjectAbi,
              functionName: 'assignClaims',
              args: [beneficiary, rahatTokenAddress, BigInt(amount)],
            });
          },
        );
        console.log(`first`);
        await multi.writeContractAsync({
          args: [encodeAssignClaimsToBeneficiary],
          address: c2cProjectAddress,
        });

        // const encodeGetBeneficiaryClaims = beneficiaryAddresses.map(
        //   (beneficiary) => {
        //     return encodeFunctionData({
        //       abi: c2CProjectAbi,
        //       functionName: 'totalClaimsAssigned',
        //       args: [],
        //     });
        //   },
        // );
        // const claims = await multi.writeContractAsync({
        //   args: [encodeGetBeneficiaryClaims],
        //   address: rahatTokenAddress,
        // });
        const encodedForDisburse = beneficiaryAddresses.map((beneficiary) => {
          return encodeFunctionData({
            abi: c2CProjectAbi,
            functionName: 'processTransferToBeneficiary',
            args: [beneficiary, rahatTokenAddress, BigInt(amount)],
          });
        });
        return multi.writeContractAsync({
          args: [encodedForDisburse],
          address: c2cProjectAddress,
        });
      },
    },
    queryClient,
  );
};

import { useRSQuery } from "@rumsan/react-query";
import Swal from "sweetalert2";
import { useMutation } from "urql";
import { encodeFunctionData } from "viem";
import { useReadRahatTokenDecimals } from "../generated-hooks/rahatToken";
import {  useWriteRahatCvaKenyaMulticall,rahatCvaKenyaAbi } from "../generated-hooks";


export const useBulkAllocateTokens = (tokenAddress: any) => {
  const multi = useWriteRahatCvaKenyaMulticall();
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
      onError: (error:any) => {
        alert.fire({
          icon: 'error',
          title: 'Error allocating tokens',
          text: error.message,
        });
      },
      onSuccess: ({  }) => {
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
    
  );
};

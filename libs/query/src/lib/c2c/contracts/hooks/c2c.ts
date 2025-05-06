import { useMutation } from '@tanstack/react-query';
import {
  encodeFunctionData,
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
} from 'viem';
import {
  c2CProjectAbi,
  useWriteC2CProjectMulticall,
} from '../generated-hooks/c2c';
import { useRSQuery } from '@rumsan/react-query';
import {
  DisbursementStatus,
  DisbursementType,
  useAddDisbursement,
} from '../../project-actions';
import { UUID } from 'crypto';
import { useProjectAction, useProjectSettingsStore } from '../../../projects';
import {
  useReadRahatToken,
  useReadRahatTokenDecimals,
} from '../generated-hooks/token';
import { PROJECT_SETTINGS_KEYS } from 'libs/query/src/config';
import { useParams } from 'next/navigation';
import { waitForTransactionReceipt } from 'viem/actions';

//Temporary solution, should be changed when crypto is implemented
export const useDepositTokenToProject = () => {
  //   const write = useWriteContract({
  //     config: {
  //   }
  // })
};

export const useTokenDetails = () => {
  const { id } = useParams();
  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id as UUID]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );
  const rahatTokenAddress = contractSettings?.rahattoken?.address;
  const token = useReadRahatTokenDecimals({
    address: rahatTokenAddress,
  });

  return token;
};

export const useMultiSigDisburseToken = ({
  disbursementId,
  projectUUID,
  rahatTokenAddress,
  config,
}: {
  disbursementId: number;
  projectUUID: UUID;
  rahatTokenAddress: `0x${string}`;
  config: any;
}) => {
  const multi = useWriteC2CProjectMulticall();
  const token = useReadRahatTokenDecimals({
    address: rahatTokenAddress,
  });
  console.log('token', token);
  const projectAction = useProjectAction(['c2c', 'disburseToken']);

  return useMutation({
    onError: (error) => {
      console.error(error);
    },
    // async onSuccess(data, variables, context) {
    //   console.log('data', data);
    //   await waitForTransactionReceipt(config, {
    //     hash: data,
    //   })
    //     .catch((e) => {
    //       console.error('Error in waiting for transaction receipt', e);
    //       throw e;
    //     })
    //     .then((receipt) => {
    //       console.log('receipt', receipt);
    //       return receipt;
    //     });

    //   await projectAction.mutateAsync({
    //     uuid: projectUUID,
    //     data: {
    //       action: 'c2cProject.disbursement.update',
    //       payload: {
    //         id: disbursementId,
    //         status: DisbursementStatus.COMPLETED,
    //       },
    //     },
    //   });
    //   console.log({ data, variables, context });
    // },
    mutationFn: async ({
      amount,
      beneficiaryAddresses,
      rahatTokenAddress,
      safeAddress,
      c2cProjectAddress,
    }: {
      beneficiaryAddresses: `0x${string}`[];
      amount: string;
      rahatTokenAddress: `0x{string}`;
      safeAddress: `0x{string}`;
      c2cProjectAddress: `0x{string}`;
    }) => {
      amount = parseUnits(amount.toString(), token.data as number).toString();
      console.log('beneficiaryAddresses', {
        amount,
        beneficiaryAddresses,
        rahatTokenAddress,
        safeAddress,
        c2cProjectAddress,
      });
      // console.log("amount", amount, BigInt(parseEther(amount.toString())))
      const encodedForDisburse = beneficiaryAddresses.map((beneficiary) => {
        return encodeFunctionData({
          abi: c2CProjectAbi,
          functionName: 'disburseExternalToken',
          args: [rahatTokenAddress, beneficiary, safeAddress, BigInt(amount)],
        });
      });
      return multi.writeContractAsync({
        args: [encodedForDisburse],
        address: c2cProjectAddress,
      });
    },
  });
};

export const useDisburseTokenToBeneficiaries = () => {
  const multi = useWriteC2CProjectMulticall();
  const { queryClient } = useRSQuery();
  console.log({ multi, queryClient });
  const addDisbursement = useAddDisbursement();
  const decimals = useTokenDetails();

  return useMutation(
    {
      onError: (error) => {
        console.error(error);
      },
      onSuccess: async () => {
        // queryClient.invalidateQueries({
        //   queryKey: ['ProjectDetails', c2cProjectAddress],
        // });
        // console.log('success', d);
        // console.log({
        //   amount,
        //   beneficiaryAddresses,
        //   c2cProjectAddress,
        //   rahatTokenAddress,
        // });
        // const de = await addDisbursement.mutateAsync({
        //   amount: formatEther(amount),
        //   beneficiaries: beneficiaryAddresses,
        //   from: c2cProjectAddress,
        //   transactionHash: d,
        //   type: disburseMethod as DisbursementType,
        //   timestamp: new Date().toISOString(),
        //   status: DisbursementStatus.COMPLETED,
        //   projectUUID,
        // });
        // await addDisbursement.mutateAsync({
        //   amount: d,
        //   c2cProjectAddress
        // })
      },
      mutationFn: async ({
        amount,
        beneficiaryAddresses,
        rahatTokenAddress,
        c2cProjectAddress,
        projectUUID,
        disburseMethod,
      }: {
        beneficiaryAddresses: `0x${string}`[];
        amount: string;
        rahatTokenAddress: `0x{string}`;
        c2cProjectAddress: `0x{string}`;
        disburseMethod: string;
        projectUUID: UUID;
      }) => {
        // const encodeAssignClaimsToBeneficiary = beneficiaryAddresses.map(
        //   (beneficiary) => {
        //     return encodeFunctionData({
        //       abi: c2CProjectAbi,
        //       functionName: 'assignClaims',
        //       args: [beneficiary, rahatTokenAddress, BigInt(amount)],
        //     });
        //   },
        // );

        // await multi.writeContractAsync({
        //   args: [encodeAssignClaimsToBeneficiary],
        //   address: c2cProjectAddress,
        // });

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

        amount = parseUnits(
          amount.toString(),
          decimals.data as number,
        ).toString();
        console.log({ c2CProjectAbi, rahatTokenAddress, amount });
        const encodedForDisburse = beneficiaryAddresses.map((beneficiary) => {
          console.log({ beneficiary });
          return encodeFunctionData({
            abi: c2CProjectAbi,
            functionName: 'disburseProjectToken',
            args: [rahatTokenAddress, beneficiary, BigInt(amount)],
          });
        });
        const claim = await multi.writeContractAsync({
          args: [encodedForDisburse],
          address: c2cProjectAddress,
        });
        if (claim) {
          queryClient.invalidateQueries({
            queryKey: ['ProjectDetails', c2cProjectAddress],
          });
          // console.log('success', d);
          console.log({
            amount,
            beneficiaryAddresses,
            c2cProjectAddress,
            rahatTokenAddress,
          });
          const de = await addDisbursement.mutateAsync({
            amount: formatEther(BigInt(amount)),
            beneficiaries: beneficiaryAddresses,
            from: c2cProjectAddress,
            transactionHash: claim,
            type: disburseMethod as DisbursementType,
            timestamp: new Date().toISOString(),
            status: DisbursementStatus.COMPLETED,
            projectUUID: projectUUID,
          });
          return de;
        }
      },
    },
    queryClient,
  );
};

'use client';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import React, { FC, use, useCallback, useEffect, useState } from 'react';
import CreateToken from './1.create.token';
import Confirmation from './2.confirmation';
import { useSettingsStore, useTokenCreate } from '@rahat-ui/query';
import { useBlock, useWaitForTransactionReceipt } from 'wagmi';
import { useTreasuryTokenCreate } from 'libs/query/src/lib/treasury/treasury.service';
import { symbol } from 'zod';
import { init } from 'next/dist/compiled/webpack/webpack';
import { initial } from 'lodash';
import { getBlock } from 'viem/actions';

// type FundManagementFlowProps = {
//   selectedBeneficiaries: {
//     walletAddress: `0x${string}`;
//     amount: string;
//   }[];
// };
export const initialStepData = {
  tokenName: '',
  symbol: '',
  initialSupply: '',
  description: '',
};

const CreateTokenFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] =
    useState<typeof initialStepData>(initialStepData);
  const [transactionHash, setTransactionHash] = useState<`0x${string}`>();
  const [isTransacting, setIsTransacting] = useState<boolean>(false);
  const [blockNumber, setBlockNumber] = useState<number>();

  const createToken = useTokenCreate();
  const treasuryToken = useTreasuryTokenCreate();

  const handleStepDataChange = (e) => {
    const { name, value } = e.target;
    setStepData((prev) => ({ ...prev, [name]: value }));
  };

  const [tokenAddress, setTokenAddress] = useState<`0x${string}`>();

  const accessManagerContract = useSettingsStore(
    (state) => state.accessManager,
  );
  const rahatTreasuryContract = useSettingsStore(
    (state) => state.rahatTreasury,
  );

  const result = useWaitForTransactionReceipt({
    hash: transactionHash,
  });

  useEffect(() => {
    if (blockNumber) {
      const update = async () => {
        const contractAddress: any = result?.data?.logs[2]?.topics[1];
        console.log({ contractAddress });
        await treasuryToken.mutateAsync({
          name: stepData.tokenName,
          symbol: stepData.symbol,
          description: stepData.description,
          decimals: 18,
          initialSupply: stepData.initialSupply,
          contractAddress: `0x${contractAddress.slice(-40)}`,
          fromBlock: blockNumber,
          transactionHash: result?.data?.transactionHash as `0x${string}`,
        });
      };
      update();
    }
  }, [blockNumber]);

  useEffect(() => {
    if (result?.data) {
      setBlockNumber(Number(result.data.blockNumber));
      console.log(result.data);
      console.log(Number(result.data.blockNumber));
      setIsTransacting(false);
    }
  }, [result.isFetching]);

  const steps = [
    {
      id: 'step1',
      title: 'Disburse Method',
      component: (
        <CreateToken
          handleStepDataChange={handleStepDataChange}
          stepData={stepData}
        />
      ),
      // validation: {
      //   noMethodSelected: {
      //     condition: () => !stepData.treasurySource,
      //     message: 'Please select a disburse method',
      //   },
      // },
      validation: {},
    },
    {
      id: 'step2',
      title: 'Disburse Amount',
      component: (
        <Confirmation
          handleStepDataChange={handleStepDataChange}
          stepData={stepData}
        />
      ),
      validation: {},
    },
  ];

  const handleNext = () => {
    const currentStepValidations = steps[currentStep].validation;
    const validationErrors = Object.entries(currentStepValidations)
      .filter(([_, validation]) => validation.condition())
      .map(([_, validation]) => validation.message);

    if (validationErrors.length > 0) {
      console.log(validationErrors);
      alert(validationErrors.join('\n'));
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirm = async () => {
    const result: any = await createToken.mutateAsync({
      name: stepData.tokenName,
      symbol: stepData.symbol,
      description: stepData.description,
      decimals: 18,
      // todo: rahat access manager address shoudld be small case
      manager: accessManagerContract as `0x${string}`,
      rahatTreasuryAddress: rahatTreasuryContract as `0x${string}`,
      initialSupply: stepData.initialSupply,
    });
    setTransactionHash(result as `0x${string}`);
  };
  const renderComponent = () => {
    // if (!!stepData.treasurySource && disburseMultiSig.isSuccess) {
    //   return <div>Disbursement Successful</div>;
    // }

    return steps[currentStep].component;
  };

  useCallback(() => {
    if (tokenAddress) {
      useSettingsStore.setState({ tokenSettings: { data: tokenAddress } });
    }
  }, [tokenAddress]);
  return (
    <div>
      <div>{renderComponent()}</div>
      {
        <div className="flex items-center justify-end gap-4 mx-4 mb-4">
          <Button
            className="w-48 text-red-600 bg-pink-200 hover:bg-pink-300"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          <Button
            className="w-48 "
            onClick={
              steps[currentStep].id === 'step2' ? handleConfirm : handleNext
            }
          >
            {currentStep === steps.length - 1 ? 'Confirm' : 'Proceed'}
          </Button>
        </div>
      }
    </div>
  );
};

export default CreateTokenFlow;

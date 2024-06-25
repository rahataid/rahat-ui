'use client';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import React, { FC, useState } from 'react';
import CreateToken from './1.create.token';
import Confirmation from './2.confirmation';
import { useTokenCreate } from '@rahat-ui/query';

// type FundManagementFlowProps = {
//   selectedBeneficiaries: {
//     walletAddress: `0x${string}`;
//     amount: string;
//   }[];
// };
export const initialStepData = {
  tokenName: '',
  symbol: '',
  count: '',
  description: '',
};

const CreateTokenFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] =
    useState<typeof initialStepData>(initialStepData);

  const handleStepDataChange = (e) => {
    const { name, value } = e.target;
    setStepData((prev) => ({ ...prev, [name]: value }));
  };

  console.log('stepData', stepData);

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
  const createToken = useTokenCreate();

  const handleConfirm = async () => {
    await createToken.mutateAsync({
      _name: stepData.tokenName,
      _symbol: stepData.symbol,
      _description: stepData.description,
      decimals: 0,
      _manager: '0x17e12d00982b6F0ec5d8801438D3C3CBbA0C7966' as `0x${string}`,
      rahatTreasuryAddress:
        '0x94D92Dd6e5125b79A055E7AFB7397Eba24d37793' as `0x${string}`,
    });
  };
  const renderComponent = () => {
    // if (!!stepData.treasurySource && disburseMultiSig.isSuccess) {
    //   return <div>Disbursement Successful</div>;
    // }

    return steps[currentStep].component;
  };
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

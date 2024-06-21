'use client';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import React, { FC, useState } from 'react';
import CreateToken from './1.create.token';
import Confirmation from './2.confirmation';

// type FundManagementFlowProps = {
//   selectedBeneficiaries: {
//     walletAddress: `0x${string}`;
//     amount: string;
//   }[];
// };
const initialStepData = {};

const CreateTokenFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] =
    useState<typeof initialStepData>(initialStepData);

  const steps = [
    {
      id: 'step1',
      title: 'Disburse Method',
      component: <CreateToken />,
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
      component: <Confirmation />,
      validation: {},
    },
  ];

  const handleStepDataChange = (e) => {
    const { name, value } = e.target;
    setStepData((prev) => ({ ...prev, [name]: value }));
  };

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
        <div className="flex items-center justify-end gap-4 mx-4">
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
              steps[currentStep].id === 'confirm_send' ? () => {} : handleNext
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

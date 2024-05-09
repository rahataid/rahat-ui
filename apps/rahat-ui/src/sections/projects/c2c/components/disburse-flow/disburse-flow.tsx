import React, { FC, useState } from 'react';
import Step1DisburseMethod from './1-disburse-method';
import Step2DisburseAmount from './2-disburse-amount';
import Step3DisburseSummary from './3-disburse-summary';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { AlertDialogHeader } from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import {
  useC2CProjectSubgraphStore,
  useDisburseTokenToBeneficiaries,
} from '@rahataid/c2c-query';
import { useParams } from 'next/navigation';
import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';

type DisburseFlowProps = {
  selectedBeneficiaries: string[];
};

const DisburseFlow: FC<DisburseFlowProps> = ({ selectedBeneficiaries }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState<Record<string, any>>({});
  const projectSubgraphDetails = useC2CProjectSubgraphStore(
    (state) => state.projectDetails,
  );

  const { id } = useParams();
  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );
  console.log('contractSettings', contractSettings);
  const disburseToken = useDisburseTokenToBeneficiaries();

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

  const handleDisburseToken = async () => {
    await disburseToken.mutateAsync({
      amount: stepData.disburseAmount,
      beneficiaryAddresses: selectedBeneficiaries as `0x${string}`[],
      rahatTokenAddress: contractSettings?.rahattoken?.address,
    });
  };
  const steps = [
    {
      id: 'step1',
      title: 'Disburse Method',
      component: (
        <Step1DisburseMethod
          selectedBeneficiaries={selectedBeneficiaries}
          value={stepData.depositMethod}
          onChange={handleStepDataChange}
          projectSubgraphDetails={projectSubgraphDetails}
        />
      ),
      validation: {
        noMethodSelected: {
          condition: () => !!stepData.disburseMethod,
          message: 'Please select a disburse method',
        },
      },
    },
    {
      id: 'step2',
      title: 'Disburse Amount',
      component: (
        <Step2DisburseAmount
          selectedBeneficiaries={selectedBeneficiaries}
          value={stepData.disburseAmount}
          onChange={handleStepDataChange}
          projectSubgraphDetails={projectSubgraphDetails}
        />
      ),
      validation: {
        noAmountEntered: {
          condition: () => {
            return !stepData.disburseAmount;
          },
          message: 'Please enter an amount',
        },
      },
    },
    {
      id: 'confirm_send',
      title: 'Review & Confirm',
      component: (
        <Step3DisburseSummary
          selectedBeneficiaries={selectedBeneficiaries}
          token="USDC"
          value={stepData.disburseAmount}
          projectSubgraphDetails={projectSubgraphDetails}
        />
      ),
      validation: {},
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Disburse Token</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <AlertDialogHeader>
          <DialogTitle>{steps[currentStep].title}</DialogTitle>
        </AlertDialogHeader>
        <div>
          <div>{steps[currentStep].component}</div>
          <div className="flex justify-between">
            <Button onClick={handlePrevious} disabled={currentStep === 0}>
              Back
            </Button>
            <Button
              onClick={
                steps[currentStep].id === 'confirm_send'
                  ? handleDisburseToken
                  : handleNext
              }
              // disabled={currentStep === steps.length - 1}
            >
              {currentStep === steps.length - 1 ? 'Confirm' : 'Proceed'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DisburseFlow;

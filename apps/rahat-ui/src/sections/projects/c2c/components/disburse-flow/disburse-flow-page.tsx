'use client';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { FC, useState } from 'react';
import { Stepper } from 'react-form-stepper';
import Step1DisburseMethod from './1-disburse-method';
import Step2DisburseAmount from './2-disburse-amount';
import Step3DisburseSummary from './3-disburse-summary';

import {
  PROJECT_SETTINGS_KEYS,
  useC2CProjectSubgraphStore,
  useDisburseTokenToBeneficiaries,
  useDisburseTokenUsingMultisig,
  useProject,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { parseEther } from 'viem';

type DisburseFlowProps = {
  selectedBeneficiaries: string[];
};

const initialStepData = {
  treasurySource: '',
  disburseAmount: '',
};

const DisburseFlow: FC<DisburseFlowProps> = ({ selectedBeneficiaries }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] =
    useState<Record<string, any>>(initialStepData);
  const projectSubgraphDetails = useC2CProjectSubgraphStore(
    (state) => state.projectDetails,
  );

  const { id } = useParams() as { id: UUID };
  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );
  const disburseToken = useDisburseTokenToBeneficiaries();
  const disburseMultiSig = useDisburseTokenUsingMultisig();
  const { data: projectData } = useProject(id);
  const treasurySources =
    (projectData?.data?.extras?.treasury?.treasurySources as string[]) || [];

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
    if (stepData.treasurySource === 'MULTISIG') {
      await disburseMultiSig.mutateAsync({
        amount: stepData.disburseAmount,
        projectUUID: id,
        beneficiaryAddresses: selectedBeneficiaries as `0x${string}`[],
        disburseMethod: stepData.treasurySource,
        rahatTokenAddress: contractSettings?.rahattoken?.address,
        c2cProjectAddress: contractSettings?.c2cproject?.address,
      });
      return;
    }
    await disburseToken.mutateAsync({
      amount: parseEther(stepData.disburseAmount),
      beneficiaryAddresses: selectedBeneficiaries as `0x${string}`[],
      rahatTokenAddress: contractSettings?.rahattoken?.address,
      c2cProjectAddress: contractSettings?.c2cproject?.address,
      disburseMethod: stepData.treasurySource,
      projectUUID: id,
    });
  };

  const steps = [
    {
      id: 'step1',
      title: 'Disburse Method',
      component: (
        <Step1DisburseMethod
          selectedBeneficiaries={selectedBeneficiaries}
          value={stepData.treasurySource}
          onChange={handleStepDataChange}
          projectSubgraphDetails={projectSubgraphDetails}
          treasurySources={treasurySources}
        />
      ),
      validation: {
        noMethodSelected: {
          condition: () => !stepData.treasurySource,
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
          condition: () => !stepData.disburseAmount,
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

  const renderComponent = () => {
    if (disburseToken.isSuccess || disburseMultiSig.isSuccess) {
      return <div>Disbursement Successful</div>;
    }
    if (disburseMultiSig.isPending) {
      return <div>Creating MultiSig...</div>;
    }
    return steps[currentStep].component;
  };

  return (
    <div className="sm:max-w-[450px]">
      <div className="bg-card p-4 rounded">
        <Stepper
          steps={steps.map((step) => ({ label: step.title }))}
          activeStep={currentStep}
          styleConfig={{
            completedBgColor: '#10b981',
            activeBgColor: '#3b82f6',
            inactiveBgColor: '#9ca3af',
          }}
          connectorStateColors={true}
          connectorStyleConfig={{
            completedColor: '#10b981',
            activeColor: '#3b82f6',
            disabledColor: '#9ca3af',
          }}
        />
      </div>
      <div className="mt-4">
        <div>{renderComponent()}</div>
        {!disburseToken.isSuccess && !disburseMultiSig.isSuccess && (
          <div className="flex justify-between mt-4">
            <Button onClick={handlePrevious} disabled={currentStep === 0}>
              Back
            </Button>
            <Button
              onClick={
                steps[currentStep].id === 'confirm_send'
                  ? handleDisburseToken
                  : handleNext
              }
            >
              {currentStep === steps.length - 1 ? 'Confirm' : 'Proceed'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisburseFlow;

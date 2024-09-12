import {
  PROJECT_SETTINGS_KEYS,
  useC2CProjectSubgraphStore,
  useDisburseTokenToBeneficiaries,
  useDisburseTokenUsingMultisig,
  useGetSafePendingTransactions,
  usePagination,
  useProject,
  useProjectBeneficiaries,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import Stepper from 'apps/rahat-ui/src/components/stepper';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { parseEther } from 'viem';
import Step1DisburseMethod from './1-disburse-method';
import Step2DisburseAmount from './2-disburse-amount';
import Step3DisburseSummary from './3-disburse-summary';
import { WarningModal } from './warning';

type DisburseFlowProps = {
  selectedBeneficiaries?: string[];
};

const initialStepData = {
  treasurySource: '',
  disburseAmount: '',
};

const DisburseFlow: FC<DisburseFlowProps> = ({ selectedBeneficiaries }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] =
    useState<typeof initialStepData>(initialStepData);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const projectSubgraphDetails = useC2CProjectSubgraphStore(
    (state) => state.projectDetails,
  );
  const route = useRouter();
  const { id } = useParams() as { id: UUID };
  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );

  const pendingTransactions = useGetSafePendingTransactions(id);

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
    } else {
      setIsWarningModalOpen(true);
    }
  };

  const handleDisburseToken = async () => {
    setIsWarningModalOpen(false);

    if (selectedBeneficiaries && selectedBeneficiaries?.length > 0) {
      if (stepData.treasurySource === 'MULTISIG') {
        await disburseMultiSig.mutateAsync({
          amount: String(
            +stepData.disburseAmount * selectedBeneficiaries?.length ?? 0,
          ),
          projectUUID: id,
          beneficiaryAddresses: selectedBeneficiaries as `0x${string}`[],
          disburseMethod: stepData.treasurySource,
          rahatTokenAddress: contractSettings?.rahattoken?.address,
          c2cProjectAddress: contractSettings?.c2cproject?.address,
        });
        return;
      }
    }

    await disburseToken.mutateAsync({
      amount: parseEther(stepData.disburseAmount),
      beneficiaryAddresses: selectedBeneficiaries as `0x${string}`[],
      rahatTokenAddress: contractSettings?.rahattoken?.address,
      c2cProjectAddress: contractSettings?.c2cproject?.address,
      disburseMethod: stepData.treasurySource,
      projectUUID: id,
    });

    route.push(
      `/projects/c2c/${id}/beneficiary/disburse-flow/disburse-confirm`,
    );
  };

  const handlePrevious = () => {
    if (currentStep === 0) {
      route.push(`/projects/c2c/${id}/beneficiary`);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    {
      id: 'step1',
      component: (
        <Step1DisburseMethod
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
      component: (
        <Step2DisburseAmount
          selectedBeneficiaries={
            selectedBeneficiaries ? selectedBeneficiaries : []
          }
          value={stepData.disburseAmount}
          onChange={handleStepDataChange}
          projectSubgraphDetails={projectSubgraphDetails}
          treasurySource={stepData.treasurySource}
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

  useEffect(() => {
    if (disburseMultiSig.isSuccess && disburseToken.isSuccess) {
      setCurrentStep(0);
      setStepData(initialStepData);
    }
  }, [disburseMultiSig.isSuccess, disburseToken.isSuccess]);

  const renderComponent = () => {
    if (disburseMultiSig.isPending) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 text-lg">
            Please Wait...Executing MultiSig Transaction
          </div>
          <div className="ml-4">
            <svg
              className="animate-spin h-5 w-5 text-gray-500"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-1.647zM12 20c3.042 0 5.824-1.135 7.938-3l-1.647-3A7.962 7.962 0 0112 16v4zm5.938-11H20c0-3.042-1.135-5.824-3-7.938l-3 1.647A7.962 7.962 0 0116 12h4zm-11-5.938V4c-3.042 0-5.824 1.135-7.938 3l1.647 3A7.962 7.962 0 014 8.062z"
              />
            </svg>
          </div>
        </div>
      );
    }
    return steps[currentStep].component;
  };

  const holdMultiSig =
    stepData?.treasurySource === 'MULTISIG' &&
    pendingTransactions?.data?.results?.length;

  return (
    <div className="p-2 mx-2 flex flex-col justify-evenly">
      <div className="bg-card rounded-lg mx-4 mt-4">
        <Stepper currentStep={currentStep} steps={steps} />
      </div>
      <div>{renderComponent()}</div>
      <div className="flex items-center justify-end gap-4">
        {holdMultiSig && (
          <p className="text-red-500 text-sm">
            Pending transactions. Can't proceed right now.
          </p>
        )}
        {!disburseMultiSig.isPending && (
          <div>
            <Button className="mr-3" onClick={handlePrevious}>
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={
                holdMultiSig ||
                disburseMultiSig.isPending ||
                disburseToken.isPending
              }
            >
              {currentStep === steps.length - 1 ? 'Confirm' : 'Proceed'}
            </Button>
          </div>
        )}
      </div>
      {isWarningModalOpen && (
        <WarningModal
          open={isWarningModalOpen}
          onClose={() => setIsWarningModalOpen(false)}
          onConfirm={handleDisburseToken}
        />
      )}
    </div>
  );
};

export default DisburseFlow;

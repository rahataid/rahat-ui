'use client';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useState } from 'react';
import DisbursementPlan from './1-disbursement-plan';
import DisbursementCondition, {
  DisbursementConditionType,
} from './2-disbursement-condition';
import DisbursementConfirmation from './3-confirmation';
import { useCreateDisbursementPlan } from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';

// type FundManagementFlowProps = {
//   selectedBeneficiaries: {
//     walletAddress: `0x${string}`;
//     amount: string;
//   }[];
// };
export const initialStepData = {
  bulkInputAmount: '',
  selectedBeneficiaries: [] as { walletAddress: string; amount: string }[],
  selectedConditions: [] as DisbursementConditionType[],
};

const FundManagementFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] =
    useState<typeof initialStepData>(initialStepData);
  const { id } = useParams() as { id: UUID };

  const createDisbursementPlan = useCreateDisbursementPlan(id);

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
        <DisbursementPlan
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
      validation: {
        noBeneficiariesSelected: {
          condition: () => !stepData.selectedBeneficiaries.length,
          message: 'Please select beneficiaries',
        },
        noInputAmount: {
          condition: () =>
            stepData.selectedBeneficiaries.length && !stepData.bulkInputAmount,
          message: 'Please send an amount to the selected beneficiaries.',
        },
      },
    },
    {
      id: 'step2',
      title: 'Disburse Amount',
      component: (
        <DisbursementCondition
          handleStepDataChange={handleStepDataChange}
          stepData={stepData}
        />
      ),
      validation: {
        noConditionsSelected: {
          condition: () => !stepData.selectedConditions.length,
          message: 'Please select at least one condition',
        },
      },
    },
    {
      id: 'confirm_send',
      title: 'Review & Confirm',
      component: (
        <DisbursementConfirmation
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
  const renderComponent = () => {
    // if (!!stepData.treasurySource && disburseMultiSig.isSuccess) {
    //   return <div>Disbursement Successful</div>;
    // }

    return steps[currentStep].component;
  };

  const handleConfirm = async () => {
    const res = await createDisbursementPlan.mutateAsync({
      beneficiaries: stepData.selectedBeneficiaries.map((beneficiary) => ({
        amount: +beneficiary.amount,
        walletAddress: beneficiary.walletAddress,
      })),
      conditions: stepData.selectedConditions,
      totalAmount:
        +stepData.bulkInputAmount ||
        +stepData.selectedBeneficiaries.reduce(
          (acc, curr) => acc + Number(curr.amount),
          0,
        ),
    });
    console.log('res', res);
  };

  return (
    <div>
      <div>{renderComponent()}</div>
      {
        <div className="flex items-center justify-end gap-4 mx-4">
          <Button
            className="w-48 text-red-600 bg-pink-200"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          <Button
            className="w-48 "
            onClick={
              steps[currentStep].id === 'confirm_send'
                ? handleConfirm
                : handleNext
            }
          >
            {currentStep === steps.length - 1 ? 'Confirm' : 'Proceed'}
          </Button>
        </div>
      }
    </div>
  );
};

export default FundManagementFlow;

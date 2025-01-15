'use client';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useEffect, useState } from 'react';
import DisbursementPlan from './1-disbursement-plan';
import DisbursementCondition, {
  DisbursementConditionType,
} from './2-disbursement-condition';
import DisbursementConfirmation from './3-confirmation';
import {
  useCreateDisbursementPlan,
  useFindAllDisbursementPlans,
  useFindAllDisbursements,
} from '@rahat-ui/query';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import { WarningDialog } from './warning.modal';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';

export const initialStepData = {
  bulkInputAmount: '',
  selectedBeneficiaries: [] as `0x${string}`[],
  selectedConditions: [] as DisbursementConditionType[],
};

const FundManagementFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] =
    useState<typeof initialStepData>(initialStepData);
  const { id } = useParams() as { id: UUID };
  const router = useRouter();

  const createDisbursementPlan = useCreateDisbursementPlan(id);
  const disbursements = useFindAllDisbursements(id, {
    hideAssignedBeneficiaries: true,
  });
  const { data: disbursementData } = useFindAllDisbursementPlans(id);

  useEffect(() => {
    const newSelectedConditions = [];
    disbursementData?.conditions.includes(
      DisbursementConditionType.BALANCE_CHECK,
    ) && newSelectedConditions.push(DisbursementConditionType.BALANCE_CHECK);
    disbursementData?.conditions.includes(
      DisbursementConditionType.APPROVER_SIGNATURE,
    ) &&
      newSelectedConditions.push(DisbursementConditionType.APPROVER_SIGNATURE);

    setStepData({ ...stepData, selectedConditions: newSelectedConditions });
  }, [disbursementData]);

  const confirmModal = useBoolean(false);

  const handleStepDataChange = (e) => {
    const { name, value } = e.target;
    setStepData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirm = async () => {
    const res = await createDisbursementPlan.mutateAsync({
      beneficiaries: disbursements.data?.map((b) => b.walletAddress),

      // beneficiaries: stepData.selectedBeneficiaries.map((b) => b.walletAddress),
      conditions: stepData.selectedConditions,
      totalAmount: +disbursements.data?.reduce(
        (acc: number, disbursement: any) => acc + disbursement.amount,
        0,
      ),
      // totalAmount: +stepData.selectedBeneficiaries.reduce(
      //   (acc, curr) => acc + Number(curr.amount),
      //   0,
      // ),
    });
    console.log('res', res);
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
    router.push(`/projects/rp/${id}/fundManagement`);
  };

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
        // noBeneficiariesSelected: {
        //   condition: () => !stepData.selectedBeneficiaries.length,
        //   message: 'Please select beneficiaries',
        // },
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
      id: 'open_confirm_modal',
      title: 'Review & Confirm',
      component: (
        <DisbursementConfirmation
          handleStepDataChange={handleStepDataChange}
          stepData={stepData}
        />
      ),
      validation: {},
    },
    {
      id: 'confirm_send',
      title: '',
      component: (
        <WarningDialog
          onCancel={handlePrevious}
          onConfirm={handleConfirm}
          open={confirmModal.value}
        />
      ),
    },
  ];

  const renderComponent = () => {
    // if (!!stepData.treasurySource && disburseMultiSig.isSuccess) {
    //   return <div>Disbursement Successful</div>;
    // }

    return steps[currentStep].component;
  };

  useEffect(() => {
    if (createDisbursementPlan.isSuccess) {
      router.push(`/projects/rp/${id}/fundManagement`);
    }
  }, [createDisbursementPlan.isSuccess, id, router]);

  const handleNextStep = (stepId: string) => {
    //  steps[currentStep].id === 'confirm_send' ? handleConfirm : handleNext;
    switch (stepId) {
      case 'confirm_send':
        return;

      case 'open_confirm_modal':
        confirmModal.onTrue();
        handleNext();
        return;

      default:
        handleNext();
        return;
    }
  };

  return (
    <div className="p-2">
      <div>{renderComponent()}</div>
      {
        <div className="flex items-center justify-end gap-4 mx-4 mt-4">
          <Button
            className="w-48 text-red-600 bg-pink-200 hover:bg-pink-300"
            onClick={handlePrevious}
          >
            Back
          </Button>
          <Button
            className="w-48 "
            disabled={createDisbursementPlan.isPending}
            onClick={() => handleNextStep(steps[currentStep].id)}
          >
            {currentStep === steps.length - 1 ? 'Submit' : 'Proceed'}
          </Button>
        </div>
      }
    </div>
  );
};

export default FundManagementFlow;

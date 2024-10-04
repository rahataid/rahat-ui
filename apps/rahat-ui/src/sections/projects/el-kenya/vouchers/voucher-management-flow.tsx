'use client';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useEffect, useState } from 'react';
import VouchersManage from './vouchers.manage';
import ConfirmSelection from './confirmation';
import {
  useBulkCreateDisbursement,
  useCreateDisbursementPlan,
  useFindAllDisbursementPlans,
  useFindAllDisbursements,
  useRpSingleBeneficiaryGroupMutation,
} from '@rahat-ui/query';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import { WarningDialog } from './warning.modal';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';

export const initialStepData = {
  bulkInputAmount: '',
  selectedBeneficiaries: [],
  selectedGroups: [],
  // selectedConditions: [] as DisbursementConditionType[],
};

const VouchersManagementFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [beneficiaryGroupSelected, setBeneficiaryGroupSelected] =
    useState(false);

  const [stepData, setStepData] =
    useState<typeof initialStepData>(initialStepData);
  const { id } = useParams() as { id: UUID };
  const router = useRouter();

  const createDisbursementPlan = useCreateDisbursementPlan(id);
  const bulkAssignDisbursement = useBulkCreateDisbursement(id);
  const beneficiaryGroup = useRpSingleBeneficiaryGroupMutation(id as UUID);

  const { data: disbursementData } = useFindAllDisbursementPlans(id);

  const confirmModal = useBoolean(false);

  const handleStepDataChange = (e) => {
    const { name, value } = e.target;
    setStepData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    const isValid = steps[currentStep]?.validation();
    if (!isValid) {
      return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setError('');
    setCurrentStep(currentStep - 1);
  };

  const handlePrevious = () => {
    router.push(`/projects/el-kenya/${id}/vouchers/manage`);
  };

  const handleBulkAssign = async () => {
    if (beneficiaryGroupSelected) {
      stepData.selectedGroups.map((selectedGroup) => {
        handleCreateGroupDisbursement(selectedGroup.uuid);
      });
      router.push(`/projects/el-kenya/${id}/vouchers`);
    } else {
      await bulkAssignDisbursement.mutateAsync({
        amount: 1,
        beneficiaries: stepData.selectedBeneficiaries?.map(
          (row) => row.walletAddress,
        ),
      });
      router.push(`/projects/el-kenya/${id}/vouchers`);
    }
  };

  const handleCreateGroupDisbursement = async (groupUUid: string) => {
    const bg = await beneficiaryGroup.mutateAsync(groupUUid as UUID);
    const walletAddresses = await bg?.groupedBeneficiaries?.map(
      (groupedBeneficiary: any) =>
        groupedBeneficiary?.Beneficiary?.walletAddress,
    );
    await bulkAssignDisbursement.mutateAsync({
      amount: 1,
      beneficiaries: walletAddresses,
    });
    // await bulkAssignDisbursement.mutateAsync({
    //   amount: 1,
    //   beneficiaries: walletAddresses,
    // });
  };

  const steps = [
    {
      id: 'step1',
      title: 'Disburse Method',
      component: (
        <VouchersManage
          handleStepDataChange={handleStepDataChange}
          handleNext={handleNext}
          setBeneficiaryGroupSelected={setBeneficiaryGroupSelected}
          stepData={stepData}
        />
      ),
      validation: () => {
        if (
          stepData.selectedBeneficiaries.length > 0 ||
          stepData.selectedGroups.length > 0
        ) {
          setError('');
          return true;
        }
        setError('Please select beneficiaries');
        return false;
      },
    },
    {
      id: 'step2',
      title: 'Disburse Amount',
      component: (
        <ConfirmSelection
          stepData={stepData}
          handleBack={handleBack}
          handleNext={handleNext}
          beneficiaryGroupSelected={beneficiaryGroupSelected}
        />
      ),
      validation: () => {
        return true;
      },
    },
    {
      id: 'confirm_send',
      title: '',
      component: (
        <WarningDialog
          onCancel={handlePrevious}
          onConfirm={handleBulkAssign}
          open={true}
        />
      ),
    },
  ];

  const renderComponent = () => {
    return steps[currentStep].component;
  };

  return (
    <div className="p-2">
      <div>{error && <p className="text-red-700 mr-8">{error}</p>}</div>
      <div>{renderComponent()}</div>
    </div>
  );
};

export default VouchersManagementFlow;

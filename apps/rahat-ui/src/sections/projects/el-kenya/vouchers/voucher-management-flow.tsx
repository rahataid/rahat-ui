'use client';
import {
  PROJECT_SETTINGS_KEYS,
  useBulkAssignKenyaVoucher,
  useBulkCreateDisbursement,
  useCreateDisbursementPlan,
  useFindAllDisbursementPlans,
  useProjectSettingsStore,
  useRpSingleBeneficiaryGroupMutation,
} from '@rahat-ui/query';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import ConfirmSelection from './confirmation';
import VouchersManage from './vouchers.manage';
import { WarningDialog } from './warning.modal';

export const initialStepData = {
  bulkInputAmount: '',
  selectedBeneficiaries: [],
  selectedGroups: [],
  // selectedConditions: [] as DisbursementConditionType[],
};

const VouchersManagementFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [openWarningModel, setOpenWarningModel] = useState(false);
  const [beneficiaryGroupSelected, setBeneficiaryGroupSelected] =
    useState(false);

  const [stepData, setStepData] =
    useState<typeof initialStepData>(initialStepData);
  const { id } = useParams() as { id: UUID };
  const router = useRouter();

  const beneficiaryGroup = useRpSingleBeneficiaryGroupMutation(id as UUID);

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );
  const syncDisbursementAllocation = useBulkAssignKenyaVoucher(
    contractSettings?.rahattoken?.address,
    id,
  );

  const handleStepDataChange = (e) => {
    const { name, value } = e.target;
    setStepData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    const isValid = steps[currentStep]?.validation();
    if (!isValid) {
      return;
    }
    if (currentStep === 1) {
      setOpenWarningModel(true);
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
    setOpenWarningModel(false);

    router.push(`/projects/el-kenya/${id}/vouchers/manage`);
  };

  const handleBulkAssign = async () => {
    if (beneficiaryGroupSelected) {
      handleBulkVoucherAssign(stepData.selectedGroups);
      // stepData.selectedGroups.map((selectedGroup) => {
      //   handleCreateGroupDisbursement(selectedGroup.uuid);
      // });
      // router.push(`/projects/el-kenya/${id}/vouchers`);
    } else {
      console.log('step', stepData.selectedBeneficiaries);
      // todo: for groups
      await syncDisbursementAllocation.mutateAsync({
        beneficiaryAddresses: stepData.selectedBeneficiaries.map((ben) => {
          return {
            walletAddress: ben?.walletAddress,
            phone: ben?.phone,
            amount: 1,
          };
        }),
        tokenAddress: contractSettings?.rahattoken?.address,
        projectAddress: contractSettings?.rahatcvakenya?.address,
      });
      // await bulkAssignDisbursement.mutateAsync({
      //   amount: 1,
      //   beneficiaries: stepData.selectedBeneficiaries?.map(
      //     (row) => row.walletAddress,
      //   ),
      // });
      router.push(`/projects/el-kenya/${id}/vouchers`);
    }
  };

  const handleBulkVoucherAssign = async (selectedGroups: any[]) => {
    const groupUUIDs = selectedGroups.map((group) => group.uuid);
    const fetchedBenAddresses = [] as {
      walletAddress: `0x${string}`;
      amount: number;
      phone: string;
    }[];
    // todo: refactor backend accordingly
    const benefciaryFromGroups = groupUUIDs.map(async (groupUUID) => {
      const ben = await beneficiaryGroup.mutateAsync(groupUUID as UUID);
      const benData = await ben?.groupedBeneficiaries?.map(
        (groupedBeneficiary: any) => ({
          walletAddress: groupedBeneficiary?.Beneficiary?.walletAddress,
          phone: groupedBeneficiary?.Beneficiary?.pii?.phone,
        }),
      );
      return benData;
    });

    const beneficiaries = await Promise.all(benefciaryFromGroups);
    beneficiaries.map((ben) => {
      ben.map(
        ({
          walletAddress,
          phone,
        }: {
          walletAddress: `0x${string}`;
          phone: string;
        }) => {
          fetchedBenAddresses.push({ walletAddress, amount: 1, phone });
        },
      );
    });
    await syncDisbursementAllocation.mutateAsync({
      // Todo: handle the case of a beneficiary being in multiple groups
      beneficiaryAddresses: fetchedBenAddresses
        .filter(
          (v, i, a) =>
            a.findIndex((t) => t.walletAddress === v.walletAddress) === i,
        )
        .map((ben) => ({
          walletAddress: ben.walletAddress,
          phone: ben.phone,
          amount: 1,
        })),
      tokenAddress: contractSettings?.rahattoken?.address,
      projectAddress: contractSettings?.rahatcvakenya?.address,
    });
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
          open={openWarningModel}
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

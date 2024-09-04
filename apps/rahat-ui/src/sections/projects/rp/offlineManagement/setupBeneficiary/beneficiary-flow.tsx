'use client';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useEffect, useState } from 'react';
import Step2DisburseAmount from './2-select-beneficiary';

import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import Step1SelectVendor from './1-select-vendor';
import Step3AssignAmount from './3-assign-amount';
import Stepper from 'apps/rahat-ui/src/components/stepper';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ConfirmPage from './confirm-page';
import { MS_ACTIONS } from '@rahataid/sdk';
import {
  useFindAllDisbursements,
  useProjectAction,
  usePagination,
  useProjectBeneficiaries,
  useFindAllBeneficiaryGroups,
} from '@rahat-ui/query';

const initialStepData = {
  treasurySource: '',
  disburseAmount: '',
};
export const OfflineBeneficiaryFormSchema = z.object({
  vendorId: z.number({
    required_error: 'Vendor id is require',
  }),
  disbursements: z.number().array(),
  groupIds: z.number().array(),
});

const SetupBeneficiaryPage = () => {
  const { id } = useParams() as { id: UUID };

  const [currentStep, setCurrentStep] = useState(0);
  const [showConfirmPage, setShowConfirmPage] = useState(false);

  const [stepData, setStepData] =
    useState<typeof initialStepData>(initialStepData);
  const getVendors = useProjectAction();

  const [vendor, setVendor] = useState([]);
  const [rowData, setRowData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const {
    pagination,
    filters,
    setFilters,
    setNextPage,
    setPrevPage,
    setPerPage,
  } = usePagination();
  const beneficiaryPagination = {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
  };
  const { data: disbursmentList, isSuccess } = useFindAllDisbursements(
    id as UUID,
    {
      hideAssignedBeneficiaries: true,
    },
  );
  const { data: benGroups } = useFindAllBeneficiaryGroups(id as UUID);

  const projectBeneficiaries = useProjectBeneficiaries({
    page: pagination.page,
    perPage: pagination.perPage,
    // pagination.perPage,
    order: 'desc',
    sort: 'updatedAt',
    projectUUID: id,
    ...filters,
  });

  useEffect(() => {
    if (
      projectBeneficiaries.isSuccess &&
      projectBeneficiaries.data?.data &&
      isSuccess
    ) {
      const projectBeneficiaryDisbursements = disbursmentList
        .filter((beneficiary) => {
          return projectBeneficiaries.data?.data?.some(
            (disbursement) =>
              disbursement.walletAddress === beneficiary.walletAddress,
          );
        })
        .map((beneficiary) => {
          const beneficiaryDisbursement = projectBeneficiaries.data?.data?.find(
            (disbursement) =>
              disbursement.walletAddress === beneficiary.walletAddress,
          );
          return {
            ...beneficiaryDisbursement,
            disbursementAmount: beneficiary?.amount || '0',
            disbursmentId: beneficiary?.id,
          };
        });

      if (
        JSON.stringify(projectBeneficiaryDisbursements) !==
        JSON.stringify(rowData)
      ) {
        setRowData(projectBeneficiaryDisbursements);
      }
    }
  }, [
    disbursmentList,
    isSuccess,
    projectBeneficiaries.data?.data,
    projectBeneficiaries.isSuccess,
    rowData,
  ]);

  async function fetchVendors() {
    const result = await getVendors.mutateAsync({
      uuid: id as UUID,
      data: {
        action: MS_ACTIONS.VENDOR.LIST_BY_PROJECT,
        payload: {
          page: currentPage,
          perPage: 100,
        },
      },
    });
    setVendor(result.data);
  }

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleNext = () => {
    const isValid = steps[currentStep].validation();
    if (!isValid) {
      return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowConfirmPage(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const form = useForm<z.infer<typeof OfflineBeneficiaryFormSchema>>({
    resolver: zodResolver(OfflineBeneficiaryFormSchema),
  });

  const steps = [
    {
      id: 'step1',
      title: 'Select Vendor',
      component: <Step1SelectVendor vendor={vendor} form={form} />,
      validation: () => {
        const vendorId = form.getValues('vendorId');
        if (vendorId) {
          return true;
        }
        return false;
      },
    },
    {
      id: 'step2',
      title: 'Select Beneficiaries',
      component: (
        <Step2DisburseAmount
          disbursmentList={rowData}
          benificiaryGroups={benGroups}
          form={form}
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
          pagination={beneficiaryPagination}
        />
      ),
      validation: () => {
        const disbursements = form.getValues('disbursements') || [];
        const groupIds = form.getValues('groupIds') || [];

        if (disbursements.length || groupIds.length > 0) {
          return true;
        }
        return false;
      },
    },
    {
      id: 'step3',
      title: 'Assign Amount',
      component: (
        <Step3AssignAmount
          form={form}
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
        />
      ),
      validation: () => {
        return true;
      },
    },
  ];

  const renderComponent = () => {
    return steps[currentStep].component;
  };
  return (
    <div>
      {!showConfirmPage ? (
        <div>
          <div className="mb-10">
            <Stepper
              currentStep={currentStep}
              steps={steps.map((step) => ({ id: step.id, title: step.title }))}
            />
          </div>
          <div>{renderComponent()}</div>
          {
            // !disburseToken.isSuccess &&
            // !disburseMultiSig.isSuccess &&

            <div className="flex items-center justify-end gap-4">
              <Button onClick={handlePrevious} disabled={currentStep === 0}>
                Back
              </Button>
              <Button onClick={handleNext}>
                {currentStep === steps.length - 1 ? 'Confirm' : 'Proceed'}
              </Button>
            </div>
          }
        </div>
      ) : (
        <>
          <ConfirmPage
            form={form}
            vendor={vendor}
            disbursmentList={rowData}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        </>
      )}
    </div>
  );
};

export default SetupBeneficiaryPage;

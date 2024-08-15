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
import { useFindAllDisbursements, useProjectAction } from '@rahat-ui/query';

const initialStepData = {
  treasurySource: '',
  disburseAmount: '',
};
export const OfflineBeneficiaryFormSchema = z.object({
  vendorId: z.number({
    required_error: 'Vendor id is require',
  }),
  disbursements: z.number().array(),
});

const SetupBeneficiaryPage = () => {
  const { id } = useParams() as { id: UUID };

  const [currentStep, setCurrentStep] = useState(0);
  const [showConfirmPage, setShowConfirmPage] = useState(false);

  const [stepData, setStepData] =
    useState<typeof initialStepData>(initialStepData);
  const getVendors = useProjectAction();

  const [vendor, setVendor] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const { data: disbursmentList, isSuccess } = useFindAllDisbursements(
    id as UUID,
  );
  async function fetchVendors() {
    const result = await getVendors.mutateAsync({
      uuid: id as UUID,
      data: {
        action: MS_ACTIONS.VENDOR.LIST_BY_PROJECT,
        payload: {
          page: currentPage,
          perPage,
        },
      },
    });
    setVendor(result.data);
  }

  useEffect(() => {
    fetchVendors();
  }, []);
  const route = useRouter();

  const handleStepDataChange = (e) => {
    const { name, value } = e.target;
    setStepData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowConfirmPage(true);
      // route.push(
      //   `/projects/rp/${id}/offlineManagement/setupBeneficiary/confirm`,
      // );
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
      validation: {},
    },
    {
      id: 'step2',
      title: 'Select Beneficiaries',
      component: (
        <Step2DisburseAmount disbursmentList={disbursmentList} form={form} />
      ),
      validation: {},
    },
    {
      id: 'step3',
      title: 'Assign Amount',
      component: <Step3AssignAmount form={form} />,
      validation: {},
    },
  ];

  const renderComponent = () => {
    return steps[currentStep].component;
  };
  console.log(form.getValues('vendorId'), form.getValues('disbursements'));
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
            disbursmentList={disbursmentList}
          />
        </>
      )}
    </div>
  );
};

export default SetupBeneficiaryPage;

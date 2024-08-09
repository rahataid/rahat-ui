'use client';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useState } from 'react';
import Step2DisburseAmount from './2-select-beneficiary';

import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import Step1SelectVendor from './1-select-vendor';
import Step3AssignAmount from './3-assign-amount';

const initialStepData = {
  treasurySource: '',
  disburseAmount: '',
};

const SetupBeneficiaryPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] =
    useState<typeof initialStepData>(initialStepData);
  const route = useRouter();
  const { id } = useParams() as { id: UUID };

  const handleStepDataChange = (e) => {
    const { name, value } = e.target;
    setStepData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      route.push(
        `/projects/rp/${id}/offlineManagement/setupBeneficiary/confirm`,
      );
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    {
      id: 'step1',
      title: 'Select Vendor',
      component: (
        <Step1SelectVendor
          value={stepData.treasurySource}
          onChange={handleStepDataChange}
        />
      ),
      validation: {},
    },
    {
      id: 'step2',
      title: 'Select Beneficiaries',
      component: (
        <Step2DisburseAmount
          value={stepData.disburseAmount}
          onChange={handleStepDataChange}
        />
      ),
      validation: {},
    },
    {
      id: 'step3',
      title: 'Assign Amount',
      component: <Step3AssignAmount />,
      validation: {},
    },
  ];

  const renderComponent = () => {
    return steps[currentStep].component;
  };

  return (
    <div>
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
  );
};

export default SetupBeneficiaryPage;

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

type DisburseFlowProps = {
  selectedBeneficiaries: string[];
};

const DisburseFlow: FC<DisburseFlowProps> = ({ selectedBeneficiaries }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 'step1',
      title: 'Disburse Method',
      component: (
        <Step1DisburseMethod selectedBeneficiaries={selectedBeneficiaries} />
      ),
      handleNext: () => {
        nextStep();
      },
      handleBack: () => {
        prevStep();
      },
    },
    {
      id: 'step2',
      title: 'Disburse Amount',
      component: (
        <Step2DisburseAmount selectedBeneficiaries={selectedBeneficiaries} />
      ),
      handleNext: () => {
        nextStep();
      },
      handleBack: () => {
        prevStep();
      },
    },
    {
      id: 'step3',
      title: 'Review & Confirm',
      component: (
        <Step3DisburseSummary selectedBeneficiaries={selectedBeneficiaries} />
      ),
      handleNext: () => {
        nextStep();
      },
      handleBack: () => {
        prevStep();
      },
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Disburse Token</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <DialogTitle className="text-primary">
            {steps[currentStep].title}
          </DialogTitle>
        </AlertDialogHeader>
        <div>{steps[currentStep].component}</div>
        <div className="flex justify-between">
          <Button onClick={prevStep} disabled={currentStep === 0}>
            Back
          </Button>
          <Button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
          >
            Proceed
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DisburseFlow;

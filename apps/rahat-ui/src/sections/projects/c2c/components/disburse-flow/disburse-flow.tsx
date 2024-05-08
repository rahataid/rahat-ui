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
  const [stepData, setStepData] = useState<Record<string, any>>({});

  const nextStep = (e) => {
    e.preventDefault();
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = (e) => {
    e.preventDefault();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDisburseAmountFormSubmit = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    console.log('value', value);
    setStepData((prev) => ({ ...prev, [name]: value }));

    if (!stepData.disburseAmount) {
      alert('Please enter amount to disburse');
      return;
    }
    nextStep(e);

    console.log('Disburse amount form submitted');
  };

  const steps = [
    {
      id: 'step1',
      title: 'Disburse Method',
      component: (
        <Step1DisburseMethod selectedBeneficiaries={selectedBeneficiaries} />
      ),
      handleNext: nextStep,
      handleBack: prevStep,
    },
    {
      id: 'step2',
      title: 'Disburse Amount',
      component: (
        <Step2DisburseAmount selectedBeneficiaries={selectedBeneficiaries} />
      ),
      handleNext: handleDisburseAmountFormSubmit,
      handleBack: prevStep,
    },
    {
      id: 'step3',
      title: 'Review & Confirm',
      component: (
        <Step3DisburseSummary selectedBeneficiaries={selectedBeneficiaries} />
      ),
      handleNext: nextStep,
      handleBack: prevStep,
    },
  ];

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
        <form onSubmit={steps[currentStep].handleNext}>
          <div>{steps[currentStep].component}</div>
          <div className="flex justify-between">
            <Button
              onClick={steps[currentStep].handleBack}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            <Button type="submit" disabled={currentStep === steps.length - 1}>
              Proceed
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DisburseFlow;

import React from 'react';
import AssignFundsForm from './assign.funds.form';
import PayoutFundManagementForm, { PayoutFormData } from './assign.payout.form';
import Confirmation from './confirmation';

interface FundManagementFormProps {
  currentStep: number;
  handleStepChange: (step: number) => void;
  payoutData: PayoutFormData | null;
  onPayoutData: (data: PayoutFormData | null) => void;
}

const FundManagementForm = ({
  currentStep,
  handleStepChange,
  payoutData,
  onPayoutData,
}: FundManagementFormProps) => {
  switch (currentStep) {
    case 0:
      return <AssignFundsForm handleStepChange={handleStepChange} />;
    case 1:
      return (
        <PayoutFundManagementForm
          handleStepChange={handleStepChange}
          onPayoutData={onPayoutData}
          payoutData={payoutData}
        />
      );
    case 2:
      return <Confirmation payoutData={payoutData} />;
  }
};

export default FundManagementForm;

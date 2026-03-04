import { PaymentFundSchema } from '../../payout/initiatePayout/schemas/payout.validation';
import AssignFundsForm from './assign.funds.form';
import PayoutFundManagementForm, { PayoutFormData } from './assign.payout.form';
import Confirmation from './confirmation';

interface FundManagementFormProps {
  currentStep: number;
  handleStepChange: (step: number) => void;
  payoutData: PaymentFundSchema | null;
  onPayoutData: (data: PaymentFundSchema | null) => void;
  wantsPayout: boolean | null;
  onWantsPayoutChange: (value: boolean | null) => void;
}

const FundManagementForm = (props: FundManagementFormProps) => {
  // Props goes here
  const {
    currentStep,
    handleStepChange,
    payoutData,
    onPayoutData,
    wantsPayout,
    onWantsPayoutChange,
  } = props;

  switch (currentStep) {
    case 0:
      return <AssignFundsForm handleStepChange={handleStepChange} />;

    case 1:
      return (
        <PayoutFundManagementForm
          handleStepChange={handleStepChange}
          onPayoutData={onPayoutData}
          payoutData={payoutData}
          wantsPayout={wantsPayout}
          onWantsPayoutChange={onWantsPayoutChange}
        />
      );

    case 2:
      return (
        <Confirmation payoutData={payoutData} onPayoutData={onPayoutData} />
      );

    default:
      return <></>;
  }
};

export default FundManagementForm;

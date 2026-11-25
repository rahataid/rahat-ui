import { FundWithPayoutSchema } from '../../payout/initiatePayout/schemas/payout.validation';
import AssignFundsForm from './assign.funds.form';
import PayoutFundManagementForm, { PayoutFormData } from './assign.payout.form';
import Confirmation from './confirmation';
import type { FundDraft } from './assign.funds.form';

interface FundManagementFormProps {
  currentStep: number;
  handleStepChange: (step: number) => void;
  payoutData: FundWithPayoutSchema | null;
  onPayoutData: (data: FundWithPayoutSchema | null) => void;
  wantsPayout: boolean | null;
  onWantsPayoutChange: (value: boolean | null) => void;
  draft?: FundDraft | null;
  onDraftChange?: (values: FundDraft, isDirty: boolean) => void;
  onClear?: () => void;
  onComplete?: () => void;
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
    draft,
    onDraftChange,
    onClear,
    onComplete,
  } = props;

  switch (currentStep) {
    case 0:
      return (
        <AssignFundsForm
          handleStepChange={handleStepChange}
          draft={draft}
          onDraftChange={onDraftChange}
          onClear={onClear}
        />
      );

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
        <Confirmation
          payoutData={payoutData}
          onPayoutData={onPayoutData}
          onComplete={onComplete}
        />
      );

    default:
      return <></>;
  }
};

export default FundManagementForm;

import { Input } from '@rahat-ui/shadcn/src/components/ui/input';

type Step3DisburseSummaryProps = {
  selectedBeneficiaries: string[];
  value: string;
  token: string;
};

export default function Step3DisburseSummary({
  selectedBeneficiaries,
  value,
  token,
}: Step3DisburseSummaryProps) {
  return (
    <div className="px-2 pb-4">
      <p className="text-primary mt-2">Disburse USDC To Beneficiary</p>
      <div className="flex items-center justify-between mb-4">
        <h1>Project Balance</h1>
        <h1>20000 USDC</h1>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div>
          Send Amount{' '}
          <span className="text-primary">
            (4{' '}
            {selectedBeneficiaries.length > 1 ? 'Beneficiaries' : 'Beneficiary'}
            )
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between border-t mb-4">
        <h1 className="mt-2">Total Amount</h1>
        <h1 className="mt-2">
          {value} {token}
        </h1>
      </div>
    </div>
  );
}

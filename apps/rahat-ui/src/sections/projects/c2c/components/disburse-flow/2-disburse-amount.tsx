import { Input } from '@rahat-ui/shadcn/src/components/ui/input';

type Step2DisburseAmountProps = {
  selectedBeneficiaries: string[];
};

export default function Step2DisburseAmount({
  selectedBeneficiaries,
}: Step2DisburseAmountProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1>Project Balance</h1>
        <h1>20000 USDC</h1>
      </div>
      <div className="flex items-center justify-between">
        <div>
          Send Amount{' '}
          <span className="text-primary">
            ({selectedBeneficiaries.length}Beneficiar
            {selectedBeneficiaries.length > 1 ? 'ies' : 'y'} )
          </span>
        </div>
        <div className="flex w-1/4 max-w-sm items-center space-x-2 gap-2">
          <Input placeholder="100" />
          USDC
        </div>
      </div>
    </div>
  );
}

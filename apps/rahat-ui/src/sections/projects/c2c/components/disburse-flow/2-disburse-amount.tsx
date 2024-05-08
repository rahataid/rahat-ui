import { Input } from '@rahat-ui/shadcn/src/components/ui/input';

type Step2DisburseAmountProps = {
  selectedBeneficiaries: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Step2DisburseAmount({
  selectedBeneficiaries,
  onChange,
  value,
}: Step2DisburseAmountProps) {
  // const [amount, setAmount] = useState<string>('0');
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
          <Input
            name="disburseAmount"
            placeholder="Amount for each beneficiaries"
            value={value}
            onChange={onChange}
          />
          USDC
        </div>
      </div>
    </div>
  );
}

import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { useParams } from 'next/navigation';
import { formatEther } from 'viem';
import { useReadContract } from 'wagmi';

type Step2DisburseAmountProps = {
  selectedBeneficiaries: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  projectSubgraphDetails: any;
  tokenName?: string;
};

export default function Step2DisburseAmount({
  selectedBeneficiaries,
  onChange,
  value,
  projectSubgraphDetails,
  tokenName = 'USDC',
}: Step2DisburseAmountProps) {
  const { id } = useParams();

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );

  const { data, error, isLoading } = useReadContract({
    address: contractSettings?.rahattoken?.address,
    abi: contractSettings?.rahattoken?.abi,
    functionName: 'balanceOf',
    args: [contractSettings?.c2cproject?.address],
  });

  const projectBalance = data ? formatEther(BigInt(data)) : '0';

  // const [amount, setAmount] = useState<string>('0');
  return (
    <div className="px-2 pb-4 mb-2">
      <div className="flex items-center justify-between mb-4">
        <h1>Project Balance</h1>
        <h1>
          {projectBalance} {tokenName}
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <div>
          Send Amount{' '}
          <span className="text-primary">
            ({selectedBeneficiaries.length} Beneficiar
            {selectedBeneficiaries.length > 1 ? 'ies' : 'y'})
          </span>
        </div>
        <div className="flex w-1/3 max-w-sm items-center space-x-2 gap-2">
          <Input
            name="disburseAmount"
            placeholder="Amount"
            value={value}
            onChange={onChange}
          />
          {tokenName}
        </div>
      </div>
    </div>
  );
}

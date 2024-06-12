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
    <div className="bg-card rounded px-4 pb-4 flex flex-col min-h-96">
      <div className="mb-2">
        <p className="mt-8 mb-4 text-lg text-slate-800 font-semibold">
          Enter Distribution Amount
        </p>
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-slate-800">Beneficiaries Selected</p>
            <Input
              className="w-2/4 bg-gray-100"
              name="projectBalance"
              value={selectedBeneficiaries.length}
              disabled
            />
          </div>
          <div>
            <p className="text-slate-800">Project Balance</p>
            <Input
              className="w-2/4 bg-gray-100"
              name="projectBalance"
              value={projectBalance + ' ' + tokenName}
              disabled
            />
          </div>
          <div className="mb-4">
            <p className="text-slate-800">Send Amount</p>
            <div className="flex items-center gap-2">
              <Input
                className="w-2/4"
                name="disburseAmount"
                placeholder="Enter Amount To Send"
                value={value}
                onChange={onChange}
              />
              {tokenName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

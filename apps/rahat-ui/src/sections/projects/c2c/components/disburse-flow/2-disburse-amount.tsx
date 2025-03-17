import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { useParams } from 'next/navigation';
import { formatEther } from 'viem';
import { useReadContract } from 'wagmi';

type Step2DisburseAmountProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  projectSubgraphDetails: any;
  selectedBeneficiaries: string[];
  tokenName?: string;
  treasurySource: string;
};

export default function Step2DisburseAmount({
  onChange,
  value,
  selectedBeneficiaries,
  projectSubgraphDetails,
  treasurySource,
  tokenName = 'USDC',
}: Step2DisburseAmountProps) {
  const { id } = useParams();
  console.log('treasurySource', treasurySource);
  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );

  const { data } = useReadContract({
    address: contractSettings?.rahattoken?.address,
    abi: contractSettings?.rahattoken?.abi,
    functionName: 'balanceOf',
    args: [contractSettings?.c2cproject?.address],
  });

  const projectBalance = data ? formatEther(BigInt(data)) : '0';

  // const [amount, setAmount] = useState<string>('0');
  return (
    <div className="m-4 p-6 bg-card">
      <div className="flex flex-col mb-10">
        <h1 className="text-2xl font-semibold text-gray-900">
          Enter Disbursement Amount
        </h1>
      </div>

      <div className="flex flex-col gap-6">
        {/* Beneficiaries Selected */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600">
            Beneficiaries Selected
          </label>
          <div className="bg-gray-100 text-gray-800 p-2 rounded-md w-1/2">
            {selectedBeneficiaries.length}
          </div>
        </div>

        {/* Project Balance */}
        {treasurySource !== 'EOA' && treasurySource !== 'MULTISIG' && (
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">
              Project Balance
            </label>
            <div className="bg-gray-100 text-gray-800 p-2 rounded-md w-1/2">
              {projectBalance} USDC {/* Replace with dynamic value if needed */}
            </div>
          </div>
        )}

        {/* Send Amount */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600">
            Send Amount
          </label>
          <div className="flex items-center space-x-2">
            <Input
              name="disburseAmount"
              placeholder="Enter amount to send"
              value={value}
              onChange={(event) => {
                const amount = Number(event.target.value);
                if (
                  treasurySource === 'MULTISIG' ||
                  amount <= Number(projectBalance)
                ) {
                  onChange(event);
                }
              }}
              className="p-2 border border-gray-300 rounded-md w-1/2"
            />
            <span className="text-gray-600">{tokenName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { formatEther } from 'viem';
import { useReadContract } from 'wagmi';

type Step3DisburseSummaryProps = {
  selectedBeneficiaries: string[];
  value: string;
  token: string;
  projectSubgraphDetails: any;
  tokenName?: string;
};

export default function Step3DisburseSummary({
  selectedBeneficiaries,
  value,
  token,
  projectSubgraphDetails,
  tokenName = 'USDC',
}: Step3DisburseSummaryProps) {
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

  return (
    <div className="px-2 pb-4">
      <p className="text-primary mt-2">Disburse USDC To Beneficiary</p>
      <div className="flex items-center justify-between mb-4">
        <h1>Project Balance</h1>
        <h1>
          {projectBalance}
          {tokenName}
        </h1>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div>
          Send Amount{' '}
          <span className="text-primary">
            ({selectedBeneficiaries.length} Beneficiar
            {selectedBeneficiaries.length > 1 ? 'ies' : 'y'})
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between border-t mb-4">
        <h1 className="mt-2">Total Amount</h1>
        <h1 className="mt-2">
          {+value * selectedBeneficiaries.length} {token}
        </h1>
      </div>
    </div>
  );
}

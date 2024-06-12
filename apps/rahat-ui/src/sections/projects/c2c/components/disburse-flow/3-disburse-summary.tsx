import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
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
    <div className="bg-card rounded-lg px-4 pb-4 flex flex-col min-h-96">
      <p className="mt-8 mb-4 text-lg font-semibold">Confirmation</p>
      <div className="px-4 py-4 rounded-sm bg-neutral-100">
        <div className="flex flex-col gap-4 items-start">
          <div className="flex gap-4">
            <p className="w-52 text-right text-neutral-400">
              Beneficiaries Selected:
            </p>
            <p className="text-slate-800">{selectedBeneficiaries.length}</p>
          </div>
          <div className="flex gap-4">
            <p className="w-52 text-right text-neutral-400">Project Balance:</p>
            <p className="text-slate-800">
              {projectBalance} {tokenName}
            </p>
          </div>
          <div className="flex gap-4">
            <p className="w-52 text-right text-neutral-400">Send Amount:</p>
            <p className="text-slate-800">
              {value} {token}
            </p>
          </div>
          <Separator className="my-4" />
          <div className="flex gap-4">
            <p className="w-52 text-right text-neutral-400">Total Amount:</p>
            <p className="text-slate-800">{selectedBeneficiaries}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

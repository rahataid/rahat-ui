import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { User } from 'lucide-react';
import { useParams } from 'next/navigation';
import { formatEther } from 'viem';
import { useReadContract } from 'wagmi';

type Step3DisburseSummaryProps = {
  selectedBeneficiaries?: string[];
  value: string;
  token: string;
  projectSubgraphDetails: any;
  tokenName?: string;
  treasurySource: string;
};

export default function Step3DisburseSummary({
  selectedBeneficiaries,
  value,
  token,
  projectSubgraphDetails,
  tokenName = 'USDC',
  treasurySource,
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
    <div className="bg-card rounded-lg m-6 p-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-gray-900">Confirmation</h1>
        </div>
        <p className="text-gray-500 font-normal text-base">
          You can confirm your selection here
        </p>
      </div>
      <div className="mt-8 mb-8">
        <div className="flex p-4 bg-card rounded-lg space-x-6">
          <div className="flex-1 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <div className="space-y-5">
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  Beneficiaries Selected:
                </h2>
                <p className="text-lg font-semibold text-gray-800">
                  {selectedBeneficiaries?.length}
                </p>
              </div>
              {treasurySource === 'PROJECT' && (
                <div>
                  <h2 className="text-sm font-medium text-gray-500">
                    Project Balance
                  </h2>
                  <p className="text-lg font-semibold text-gray-800">
                    {projectBalance} USDC
                  </p>
                </div>
              )}
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  Send amount among beneficiaries
                </h2>
                <p className="text-lg font-semibold text-gray-800">
                  {selectedBeneficiaries &&
                    Number(value) * selectedBeneficiaries?.length}{' '}
                  USDC
                </p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  Token amount to send
                </h2>
                <p className="text-lg font-semibold text-gray-800">
                  {value} USDC
                </p>
              </div>
            </div>
          </div>

          {/* Right Section: Beneficiary List */}
          <div className="flex-1 p-6 bg-card rounded-lg border border-gray-200">
            <h2 className="text-sm font-medium text-gray-500 mb-4">
              Beneficiary List
            </h2>
            <p className="text-sm font-medium text-gray-800 mb-4">
              {selectedBeneficiaries?.length} beneficiaries selected
            </p>
            <ScrollArea className="h-[calc(100vh-700px)]">
              <ul className="space-y-2">
                {selectedBeneficiaries &&
                  selectedBeneficiaries.length > 0 &&
                  selectedBeneficiaries.map((i, index) => (
                    <li
                      key={index}
                      className="flex items-center p-1.5 bg-secondary rounded-lg"
                    >
                      <div className="flex-shrink-0 h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <User size={18} />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">{i}</p>
                      </div>
                    </li>
                  ))}
              </ul>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
    // <div className="px-2 pb-4">
    //   <p className="text-primary mt-2">Disburse USDC To Beneficiary</p>
    //   <div className="flex items-center justify-between mb-4">
    //     <h1>Project Balance</h1>
    //     <h1>
    //       {projectBalance}
    //       {tokenName}
    //     </h1>
    //   </div>
    //   <div className="flex items-center justify-between mb-4">
    //     <div>
    //       Send Amount{' '}
    //       <span className="text-primary">
    //         ({selectedBeneficiaries?.length ?? 0}
    //         Beneficiar
    //         {selectedBeneficiaries?.length && selectedBeneficiaries.length > 1
    //           ? 'ies'
    //           : 'y'}
    //         )
    //       </span>
    //     </div>
    //   </div>
    //   <div className="flex items-center justify-between border-t mb-4">
    //     <h1 className="mt-2">Total Amount</h1>
    //     <h1 className="mt-2">
    //       {+value * (selectedBeneficiaries?.length ?? 0)}
    //       {token}
    //     </h1>
    //   </div>
    // </div>
  );
}

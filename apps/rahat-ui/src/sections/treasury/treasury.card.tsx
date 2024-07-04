import {
  useReadRahatTokenBalanceOf,
  useReadRahatTokenDecimals,
  useSettingsStore,
} from '@rahat-ui/query';

import { CircleDollarSign, Folder } from 'lucide-react';
import { formatUnits } from 'viem';

type projectIProps = {
  projectAddress: `0x${string}`;
  projectName: string | undefined;
};

const TreasuryCard = ({ projectAddress, projectName }: projectIProps) => {
  const appContracts = useSettingsStore((state) => state.contracts);
  const { data: projectBalance } = useReadRahatTokenBalanceOf({
    address: appContracts?.rahattoken?.address,
    args: [projectAddress],
  });

  const { data: decimals } = useReadRahatTokenDecimals({
    address: appContracts?.rahattoken?.address,
  });

  return (
    <div className="bg-card border border-neutral-200 rounded-lg p-6 flex flex-col space-x-4">
      <div className="flex items-center">
        <div className="h-12 w-12 flex items-center justify-center rounded-md bg-secondary mr-4">
          <Folder className="text-primary" />
        </div>
        <p className="text-gray-700 font-medium">{projectName}</p>
      </div>
      <div className="flex items-center mt-4">
        <div className="flex items-center">
          <div className="flex items-center justify-center mr-4">
            <CircleDollarSign className="text-primary" />
          </div>
          <div className="flex flex-col ml-2">
            <p className="font-light text-gray-500 text-sm">Budget</p>
            <p className="text-primary font-medium">
              {formatUnits(projectBalance ?? BigInt(0), decimals ?? 18)} RTH
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreasuryCard;

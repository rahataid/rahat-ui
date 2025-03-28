import React from 'react';
import { Coins, Copy, CopyCheck, User } from 'lucide-react';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { DataCard, DataItem } from 'apps/rahat-ui/src/common';

type IProps = {
  beneficiary: any;
};

const BeneficiaryInfo = ({ beneficiary }: IProps) => {
  const { clickToCopy, copyAction } = useCopy();
  return (
    <>
      <div className="flex items-center">
        <div className="h-24 w-24 rounded-md  bg-gray-700 flex justify-center items-center">
          <User className="" color="white" />
        </div>

        <div className="flex flex-col ml-6">
          <div className="flex items-center">
            <div className="text-lg text-muted-foreground truncate w-48 overflow-hidden mr-2">
              0xb81dA6366ab7dAb06151D55Af059e496F56170d5
            </div>
            <button
              onClick={() =>
                clickToCopy('0xb81dA6366ab7dAb06151D55Af059e496F56170d5', 1)
              }
              className="ml-2 text-sm text-gray-500"
            >
              {copyAction === 1 ? <CopyCheck /> : <Copy />}
            </button>
          </div>
        </div>
      </div>

      <DataCard
        className="border-solid w-1/2 rounded-md"
        iconStyle="bg-white text-secondary-muted"
        title="Token Assigned"
        Icon={Coins}
        number={'10'}
      />

      <div className="grid grid-cols-3 gap-6 px-6 py-4">
        <DataItem label="Age" value={'10'} />
        <DataItem label="Gender" value={'Male'} />
        <DataItem label="Phone Number" value={'+9779845712531'} />
        <DataItem label="Address " value={'Hadigau-5, Kathmandu '} />
        <DataItem label="Banking Status" value={'Banked'} isBadge />
        <DataItem label="Phone Type" value={'Feature Phone'} isBadge />
        <DataItem label="Internet Type" value={'Mobile Internet'} isBadge />
      </div>
    </>
  );
};

export default BeneficiaryInfo;

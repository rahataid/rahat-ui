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
              {beneficiary?.walletAddress || 'N/A'}
            </div>
            <button
              onClick={() => clickToCopy(beneficiary?.walletAddress || '', 1)}
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
        number={beneficiary?.benTokens || 0}
      />

      <div className="grid grid-cols-3 gap-6 px-6 py-4">
        <DataItem label="Age" value={beneficiary?.projectData?.age || 'N/A'} />
        <DataItem
          label="Gender"
          value={beneficiary?.projectData?.gender || 'N/A'}
        />
        <DataItem
          label="Phone Number"
          value={beneficiary?.extras?.phone || 'N/A'}
        />
        <DataItem
          label="Address"
          value={beneficiary?.projectData?.location || 'N/A'}
        />
        <DataItem
          label="Banking Status"
          value={beneficiary?.projectData?.bankedStatus}
          isBadge
        />
        <DataItem
          label="Phone Type"
          value={beneficiary?.projectData?.phoneStatus}
          isBadge
        />
        <DataItem
          label="Internet Type"
          value={beneficiary?.projectData?.internetStatus}
          isBadge
        />
      </div>
    </>
  );
};

export default BeneficiaryInfo;

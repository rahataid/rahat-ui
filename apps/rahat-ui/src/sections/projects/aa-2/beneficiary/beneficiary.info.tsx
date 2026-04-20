import React from 'react';
import { Coins, Copy, CopyCheck, User } from 'lucide-react';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { DataCard, DataItem } from 'apps/rahat-ui/src/common';

type IProps = {
  beneficiary: any;
};

const BeneficiaryInfo = ({ beneficiary }: IProps) => {
  const { clickToCopy, copyAction } = useCopy();
  const tokenData = {
    assigned: { tokens: 12, amount: 1200 },
    redeemed: { tokens: 8, amount: 800 },
  };

  const inKindItems = [
    {
      name: 'Umbrella',
      assigned: 1,
      redeemed: 0,
    },
    {
      name: 'Water Bottle',
      assigned: 2,
      redeemed: 1,
    },
  ];

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

      {/* <DataCard
        className="border-solid w-1/2 rounded-xl"
        iconStyle="bg-white text-secondary-muted"
        title="Token Assignedd"
        Icon={Coins}
        number={beneficiary?.benTokens || 0}
      /> */}

      <div className="grid grid-cols-3 gap-6 py-4">
        <DataItem label="Age" value={beneficiary?.projectData?.age || 'N/A'} />
        <DataItem
          label="Gender"
          value={beneficiary?.projectData?.gender || 'N/A'}
        />
        <DataItem
          label="Phone Number"
          value={beneficiary?.extras?.phone || 'N/A'}
        />
        <div>
          <h1 className="text-lg text-black">Address</h1>
          <div className=" text-sm text-muted-foreground font-medium flex gap-1 capitalize">
            <p>{beneficiary?.projectData?.location || ''}</p>
            {beneficiary?.extras?.ward_no && (
              <p>ward no - {beneficiary?.extras?.ward_no}</p>
            )}
            <p>
              {!beneficiary?.extras?.location &&
                !beneficiary?.extras?.ward_no &&
                'N/A'}
            </p>
          </div>
        </div>
        <DataItem
          label="Banking Status"
          value={beneficiary?.projectData?.bankedStatus?.split('_').join(' ')}
          isBadge
        />
        <DataItem
          label="Phone Type"
          value={beneficiary?.projectData?.phoneStatus?.split('_').join(' ')}
          isBadge
        />
        <DataItem
          label="Internet Type"
          value={beneficiary?.projectData?.internetStatus?.split('_').join(' ')}
          isBadge
        />
      </div>
      <div className="p-4 border rounded-xl shadow-sm w-full max-w-2xl bg-white">
        {/* Title */}
        <h2 className="text-lg font-semibold mb-4">Token Benefits</h2>

        {/* Token Cards */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 bg-gray-100 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500">Assigned</p>
            <h3 className="text-xl font-bold">
              {tokenData.assigned.tokens} Tokens
            </h3>
            <p className="text-gray-600">
              NPR {tokenData.assigned.amount.toLocaleString()}
            </p>
          </div>

          <div className="flex-1 bg-gray-100 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500">Redeemed</p>
            <h3 className="text-xl font-bold">
              {tokenData.redeemed.tokens} Tokens
            </h3>
            <p className="text-gray-600">
              NPR {tokenData.redeemed.amount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* In-kind Benefits */}
        <h3 className="text-md font-semibold mb-3">In-kind Benefits</h3>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 font-medium border-b">
              <th className="text-left pb-2 font-medium">In-kind items</th>
              <th className="text-center pb-2 font-medium">Assigned</th>
              <th className="text-center pb-2 font-medium">Redeemed</th>
              <th className="text-center pb-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {inKindItems.map((item, index) => (
              <tr key={index} className="border-b last:border-none">
                <td className="py-3 font-medium">{item.name}</td>
                <td className="py-3 text-center">{item.assigned}</td>
                <td className="py-3 text-center">{item.redeemed}</td>
                <td className="py-3 text-center">
                  <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
                    {item.redeemed} of {item.assigned} redeemed
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BeneficiaryInfo;

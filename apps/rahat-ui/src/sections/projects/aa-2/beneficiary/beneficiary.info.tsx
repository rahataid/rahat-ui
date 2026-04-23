import React from 'react';
import { Copy, CopyCheck, User } from 'lucide-react';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { DataItem } from 'apps/rahat-ui/src/common';
import { useTokenDetails } from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import InkindDetails from './beneficiary.inkind.details';

type IProps = {
  beneficiary: any;
};

const BeneficiaryInfo = ({ beneficiary }: IProps) => {
  const params = useParams();
  const projectId = params.id as UUID;
  const beneficiaryId = params.uuid as UUID;
  const { clickToCopy, copyAction } = useCopy();

  const { data: tokenData, isPending } = useTokenDetails({
    projectUUID: projectId,
    beneficiaryUUID: beneficiaryId,
  });

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
        {isPending ? (
          <>
            <div className="animate-pulse flex gap-4 mb-6">
              <div className="flex-1 bg-gray-200 rounded-xl p-4 text-center">
                <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
              </div>

              <div className="flex-1 bg-gray-200 rounded-xl p-4 text-center">
                <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
              </div>
            </div>
            <div className="flex-1 bg-gray-200 rounded-xl p-4 text-center">
              <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
            </div>
          </>
        ) : (
          <>
            <div className="flex gap-4 mb-6">
              <div className="flex-1 bg-gray-100 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500">Assigned</p>
                <h3 className="text-xl font-bold">
                  {tokenData?.assignedToken} Tokens
                </h3>
                <p className="text-gray-600">NPR {tokenData?.assignedToken}</p>
              </div>

              <div className="flex-1 bg-gray-100 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500">Redeemed</p>
                <h3 className="text-xl font-bold">
                  {tokenData?.redemmedToken} Tokens
                </h3>
                <p className="text-gray-600">NPR {tokenData?.redemmedToken}</p>
              </div>
            </div>

            {/* In-kind Benefits */}
            {/* <h3 className="text-md font-semibold mb-3">In-kind Benefits</h3>
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
            </table> */}
          </>
        )}
        <InkindDetails />
      </div>
    </>
  );
};

export default BeneficiaryInfo;

import React from 'react';
import FundManagementDetailTable from './tables/fm.detail.table';
import { useParams } from 'next/navigation';
import { useSingleGroupReservedFunds } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { DataCard, HeaderWithBack } from 'apps/rahat-ui/src/common';

// export const FMTokensData = [
//   {
//     name: 'Tokens',
//     amount: '1000',
//   },
//   {
//     name: 'Total Beneficiaries',
//     amount: '10',
//   },
//   {
//     name: 'Created By',
//     amount: 'John Doe',
//   },
//   {
//     name: '1 Token Value',
//     amount: 'Rs. 10',
//   },
// ];

export default function FundManagementDetail() {
  const { id: projectID, fundId } = useParams();

  const { data, isLoading } = useSingleGroupReservedFunds(
    projectID as UUID,
    fundId,
  );
  const FMTokensData = [
    {
      name: 'Tokens',
      amount: data?.numberOfTokens || 'N/A',
    },
    {
      name: 'Total Beneficiaries',
      amount: data?.groupedBeneficiaries?.length || 0,
    },
    {
      name: 'Created By',
      amount: data?.createdBy ?? 'N/A',
    },
    {
      name: '1 Token Value',
      amount: 'Rs. 10',
    },
  ];
  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <HeaderWithBack
          path={`/projects/aa/${projectID}/fund-management?tab=fundManagementList`}
          title="Assign Funds"
          subtitle="Fill the form below to assign funds to beneficiaries"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        {/* <div className="flex gap-6 mb-3"> */}
        {FMTokensData?.map((i) => (
          <DataCard
            key={i.name}
            title={i.name}
            number={i.amount}
            className="border-solid  rounded-md"
            iconStyle="bg-white text-secondary-muted"
          />
        ))}
      </div>
      <FundManagementDetailTable
        title={data?.name}
        group={data?.groupedBeneficiaries}
        loading={isLoading}
      />
    </div>
  );
}

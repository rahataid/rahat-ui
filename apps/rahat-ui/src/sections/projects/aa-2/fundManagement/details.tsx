import React from 'react';
import { Back, DataCard, Heading } from 'packages/modules';
import FundManagementDetailTable from './tables/fm.detail.table';

export const FMTokensData = [
  {
    name: 'Tokens',
    amount: '1000',
  },
  {
    name: 'Total Beneficiaries',
    amount: '10',
  },
  {
    name: 'Created By',
    amount: 'John Doe',
  },
  {
    name: '1 Token Value',
    amount: 'Rs. 10',
  },
];

export default function FundManagementDetail() {
  return (
    <div className="p-4">
      <Back path="" />
      <Heading
        title="Title Demo"
        description="Detailed view of the reserved fund"
      />
      <div className="grid grid-cols-4 gap-4 mb-4">
        {FMTokensData?.map((i) => (
          <DataCard
            key={i.name}
            className="rounded-md"
            title={i.name}
            number={i.amount}
          />
        ))}
      </div>
      <FundManagementDetailTable group={[]} />
    </div>
  );
}

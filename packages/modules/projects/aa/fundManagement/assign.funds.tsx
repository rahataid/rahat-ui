import React from 'react';
import { Back, DataCard, Heading } from 'packages/modules';
import { AssignFundsForm } from './components';

const data = [
  {
    name: 'Project Balance',
    amount: '23,000',
  },
  {
    name: 'Assigned Balance',
    amount: '10,000',
  },
  {
    name: 'Available Balance',
    amount: '5,000',
  },
];
export default function AssignFundsView() {
  return (
    <div className="p-4">
      <Back path="" />
      <Heading
        title="Assign Funds"
        description="Fill the form below to assign funds to beneficiaries"
      />
      <div className="grid grid-cols-4 gap-4 mb-4">
        {data?.map((i) => (
          <DataCard
            key={i.name}
            className="rounded-md"
            title={i.name}
            number={i.amount}
          />
        ))}
      </div>
      <AssignFundsForm />
    </div>
  );
}

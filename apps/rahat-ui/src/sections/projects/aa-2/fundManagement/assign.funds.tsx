'use client';
import React from 'react';
import { AssignFundsForm } from './components';
import {
  Back,
  DataCard,
  HeaderWithBack,
  Heading,
} from 'apps/rahat-ui/src/common';
import { useParams } from 'next/navigation';

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
  const { id } = useParams();
  return (
    <div className="p-4">
      <HeaderWithBack
        path={`/projects/aa/${id}/fund-management`}
        title="Assign Funds"
        subtitle="Fill the form below to assign funds to beneficiaries"
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

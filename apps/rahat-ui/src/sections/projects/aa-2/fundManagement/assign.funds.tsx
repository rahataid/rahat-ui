'use client';
import { DataCard, HeaderWithBack } from 'apps/rahat-ui/src/common';
import { useParams } from 'next/navigation';
import { AssignFundsForm } from './components';
import { useFundAssignmentStore, useProjectAction } from '@rahat-ui/query';
import { useEffect, useState } from 'react';

export default function AssignFundsView() {
  const id = useParams().id;
  const { stellarTokenStats } = useFundAssignmentStore((state) => ({
    stellarTokenStats: state.stellarTokenStats,
  }));

  return (
    <div className="p-4">
      <HeaderWithBack
        path={`/projects/aa/${id}/fund-management`}
        title="Assign Funds"
        subtitle="Fill the form below to assign funds to beneficiaries"
      />
      <div className="grid grid-cols-4 gap-4 mb-4">
        {stellarTokenStats?.map((i) => (
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

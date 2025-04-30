'use client';
import { DataCard, HeaderWithBack } from 'apps/rahat-ui/src/common';
import { useParams } from 'next/navigation';
import { AssignFundsForm } from './components';
import { useProjectAction } from '@rahat-ui/query';
import { useEffect, useState } from 'react';

export default function AssignFundsView() {
  const projectBalance = useProjectAction();

  const id = useParams().id;

  const [data, setData] = useState<any>();

  const fetchVendors = async () => {
    const response = await projectBalance.mutateAsync({
      uuid: id as '${string}-${string}-${string}-${string}-${string}',
      data: {
        action: 'aa.stellar.getStellarStats',
        payload: {},
      },
    });
    setData(response.data);
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="p-4">
      <HeaderWithBack
        path={`/projects/aa/${id}/fund-management`}
        title="Assign Funds"
        subtitle="Fill the form below to assign funds to beneficiaries"
      />
      <div className="grid grid-cols-4 gap-4 mb-4">
        {data?.tokenStats.map((i) => (
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

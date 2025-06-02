import React from 'react';
import { Back, Heading } from '../../../../common';
import {
  OverviewCard,
  ProfileCard,
  TransactionCard,
  VendorDetailsTabs,
} from './components';
import { useGetVendorStellarStats } from '@rahat-ui/query/lib/aa';
import { useParams } from 'next/navigation';

export default function Detail() {
  const { id, vendorId } = useParams();
  const { data, isLoading } = useGetVendorStellarStats({
    projectUUID: id,
    uuid: vendorId,
    take: 10,
  });

  return (
    <div className="p-4">
      <Back path="" />
      <Heading
        title="Vendor Details"
        description="Detailed view of the selected vendor"
      />
      <div className="grid grid-cols-1  lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
        <ProfileCard />
        <OverviewCard data={data && data?.data} loading={isLoading} />
        <TransactionCard
          transaction={data && data?.data?.transactions}
          loading={isLoading}
        />
      </div>
      <VendorDetailsTabs />
    </div>
  );
}

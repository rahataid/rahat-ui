import React from 'react';
import { Back, Heading } from '../../../../common';
import {
  OverviewCard,
  ProfileCard,
  TransactionCard,
  VendorDetailsTabs,
} from './components';

export default function Detail() {
  return (
    <div className="p-4">
      <Back path="" />
      <Heading
        title="Vendor Details"
        description="Detailed view of the selected vendor"
      />
      <div className="grid grid-cols-3 gap-4 mb-4">
        <ProfileCard />
        <OverviewCard />
        <TransactionCard />
      </div>
      <VendorDetailsTabs />
    </div>
  );
}

'use client';

import * as React from 'react';
import { useSecondPanel } from '../../providers/second-panel-provider';
import { BeneficiaryLayout } from '../../sections/beneficiary';
import { useCommunityBeneficiaryNavItems } from '../../sections/community-beneficiary/useNavItems';
import DashboardLayout from '../dashboard/layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  const menuItems = useCommunityBeneficiaryNavItems();
  const { secondPanel } = useSecondPanel();
  return (
    <DashboardLayout>
      <BeneficiaryLayout menuItems={menuItems}>
        {secondPanel ? [children, secondPanel] : children}
      </BeneficiaryLayout>
    </DashboardLayout>
  );
}

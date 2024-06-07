'use client';

import * as React from 'react';
import { useSecondPanel } from '../../providers/second-panel-provider';
import CommunityBeneficiaryLayout from '../../sections/community-beneficiary/community.beneficiary.layout';
import { useCommunityBeneficiaryNavItems } from '../../sections/community-beneficiary/useNavItems';
import DashboardLayout from '../dashboard/layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  const menuItems = useCommunityBeneficiaryNavItems();
  const { secondPanel } = useSecondPanel();
  return (
    <DashboardLayout>
      <CommunityBeneficiaryLayout menuItems={menuItems}>
        {secondPanel ? [children, secondPanel] : children}
      </CommunityBeneficiaryLayout>
    </DashboardLayout>
  );
}

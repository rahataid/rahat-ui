'use client';

import * as React from 'react';
import DashboardLayout from '../dashboard/layout';
import { useBeneficiaryNavItems } from '../../sections/beneficiary/useNavItems';
import { useSecondPanel } from '../../providers/second-panel-provider';
import BenefPageLayout from '../../sections/beneficiary/benefPageLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  const menuItems = useBeneficiaryNavItems();
  const { secondPanel } = useSecondPanel();

  return (
    <DashboardLayout>
      <BenefPageLayout menuItems={menuItems}>
        {secondPanel ? [children, secondPanel] : children}
      </BenefPageLayout>
    </DashboardLayout>
  );
}

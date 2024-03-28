'use client';

import * as React from 'react';
import DashboardLayout from '../dashboard/layout';
import {
  BeneficiaryLayout,
  useBeneficiaryNavItems,
} from '../../sections/beneficiary';
import { useSecondPanel } from '../../providers/second-panel-provider';

export default function Layout({ children }: { children: React.ReactNode }) {
  const menuItems = useBeneficiaryNavItems();
  const { secondPanel } = useSecondPanel();
  return (
    <DashboardLayout>
      <BeneficiaryLayout menuItems={menuItems}>
        {secondPanel ? [children, secondPanel] : children}
      </BeneficiaryLayout>
    </DashboardLayout>
  );
}

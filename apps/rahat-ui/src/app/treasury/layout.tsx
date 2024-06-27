'use client';
import * as React from 'react';
import DashboardLayout from '../dashboard/layout';
import TreasuryLayout from '../../sections/treasury/treasury.layout';
import { useTreasuryNavItems } from '../../sections/treasury/useNavItems';
import { useSecondPanel } from '../../providers/second-panel-provider';

export default function Layout({ children }: { children: React.ReactNode }) {
  const menuItems = useTreasuryNavItems();
  const { secondPanel } = useSecondPanel();
  return (
    <DashboardLayout>
      <title>Treasury</title>
      <TreasuryLayout menuItems={menuItems}>
        {secondPanel ? [children, secondPanel] : children}
      </TreasuryLayout>
    </DashboardLayout>
  );
}

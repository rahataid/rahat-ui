'use client';

import * as React from 'react';
import DashboardLayout from '../dashboard/layout';
import VendorsLayout from '../../sections/vendors/vendors.layout';
import { useVendorsNavItems } from '../../sections/vendors/useNavItems';
import { useSecondPanel } from '../../providers/second-panel-provider';

export default function Layout({ children }: { children: React.ReactNode }) {
  const menuItems = useVendorsNavItems();
  const { secondPanel } = useSecondPanel();
  return (
    <DashboardLayout>
      {/* <VendorsLayout menuItems={menuItems}>
        {secondPanel ? [children, secondPanel] : children}
      </VendorsLayout> */}
      {children}
    </DashboardLayout>
  );
}

'use client';

import * as React from 'react';
import DashboardLayout from '../dashboard/layout';
import VendorsLayout from '../../sections/vendors/vendors.layout';
import { useSecondPanel } from '../../providers/second-panel-provider';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { secondPanel } = useSecondPanel();
  return (
    <DashboardLayout>
      <VendorsLayout>
        {secondPanel ? [children, secondPanel] : children}
      </VendorsLayout>
    </DashboardLayout>
  );
}

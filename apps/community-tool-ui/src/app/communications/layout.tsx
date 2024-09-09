'use client';

import * as React from 'react';
import { useSecondPanel } from '../../providers/second-panel-provider';
import CommsLayout from '../../sections/comms/comms-layout';
import { useCommsNavItems } from '../../sections/comms/use-comms-nav';
import DashboardLayout from '../dashboard/layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  const menuItems = useCommsNavItems();
  const { secondPanel } = useSecondPanel();
  return (
    <DashboardLayout>
      <CommsLayout menuItems={menuItems}>
        {secondPanel ? [children, secondPanel] : children}
      </CommsLayout>
    </DashboardLayout>
  );
}

'use client';

import * as React from 'react';
import DashboardLayout from '../dashboard/layout';
import TargetingPageLayout from '../../sections/targeting/targetingPageLayout';
import { useSecondPanel } from '../../providers/second-panel-provider';
import { useTargetingNavItems } from '../../sections/targeting/useNavItems';

export default function Layout({ children }: { children: React.ReactNode }) {
  const menuItems = useTargetingNavItems();
  const { secondPanel } = useSecondPanel();
  return (
    <DashboardLayout>
      <TargetingPageLayout menuItems={menuItems}>
        {secondPanel ? [children, secondPanel] : children}
      </TargetingPageLayout>
    </DashboardLayout>
  );
}

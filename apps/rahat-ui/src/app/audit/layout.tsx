'use client';

import * as React from 'react';
import DashboardLayout from '../dashboard/layout';
import AuditLayout from '../../sections/audit/audit.layout';
import { useAuditNavItems } from '../../sections/audit/useNavItems';
import { useSecondPanel } from '../../providers/second-panel-provider';

export default function Layout({ children }: { children: React.ReactNode }) {
  const menuItems = useAuditNavItems();
  const { secondPanel } = useSecondPanel();
  return (
    <DashboardLayout>
      <AuditLayout menuItems={menuItems}>
        {secondPanel ? [children, secondPanel] : children}
      </AuditLayout>
    </DashboardLayout>
  );
}

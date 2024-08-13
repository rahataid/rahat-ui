'use client';

import * as React from 'react';

import { useSecondPanel } from '../../providers/second-panel-provider';
import { useAppAuthenticationNavItems } from '../../sections/auth-apps';
import AppAuthenticationLayout from '../../sections/auth-apps/appAuthenticationLayout';
import DashboardLayout from '../dashboard/layout';

export default function AuthenticationAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { secondPanel } = useSecondPanel();

  const menuItems = useAppAuthenticationNavItems();

  return (
    <DashboardLayout>
      <AppAuthenticationLayout menuItems={menuItems}>
        {secondPanel ? [children, secondPanel] : children}
      </AppAuthenticationLayout>
    </DashboardLayout>
  );
}

'use client';

import * as React from 'react';
import DashboardLayout from '../dashboard/layout';
import UserLayout from '../../sections/users/user.layout';
import { useUsersNavItems } from '../../sections/users/useNavItems';
import { useSecondPanel } from '../../providers/second-panel-provider';

export default function Layout({ children }: { children: React.ReactNode }) {
  const menuItems = useUsersNavItems();
  const { secondPanel } = useSecondPanel();
  return (
    <DashboardLayout>
      <UserLayout menuItems={menuItems}>
        {secondPanel ? [children, secondPanel] : children}
      </UserLayout>
    </DashboardLayout>
  );
}

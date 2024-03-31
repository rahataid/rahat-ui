'use client';

import * as React from 'react';
import DashboardLayout from '../dashboard/layout';
import UserLayout from '../../sections/users/user.layout';
import { useUsersNavItems } from '../../sections/users/useNavItems';

export default function Layout({ children }: { children: React.ReactNode }) {
  const menuItems = useUsersNavItems();
  return (
    <DashboardLayout>
      <UserLayout menuItems={menuItems}>{children}</UserLayout>
    </DashboardLayout>
  );
}

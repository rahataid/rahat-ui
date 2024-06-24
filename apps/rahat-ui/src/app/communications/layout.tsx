'use client';

import * as React from 'react';
import DashboardLayout from '../dashboard/layout';
import { useNavItems } from '../../sections/communications/useNavItems';
import { CommunicationLayout } from '../../sections/communications/components';
import { usePathname } from 'next/navigation';

export default function CommunicationLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const menuItems = useNavItems();
  const allowedPaths = ['/communications/add'];
  return (
    <DashboardLayout>
      <title>Communications</title>
      {!allowedPaths.includes(pathName) ? (
        <>{children}</>
      ) : (
        <CommunicationLayout menuItems={menuItems}>
          {children}
        </CommunicationLayout>
      )}
    </DashboardLayout>
  );
}

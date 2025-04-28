'use client';

import * as React from 'react';
import { Nav } from '../../components/nav';
import AuthGuard from '../../guards/auth-guard';
import SideNav from '../../components/side-nav';
import { SidebarProvider } from '@rahat-ui/shadcn/src/components/ui/sidebar';

export default function DashboardLayout({
  children,
  hasDefaultHeader = true,
}: {
  margin?: string;
  children: React.ReactNode;
  hasDefaultHeader?: boolean;
}) {
  return (
    <AuthGuard>
      <SidebarProvider>
        {hasDefaultHeader && <SideNav />}
        <div className="w-full">
          <Nav hasDefaultHeader={hasDefaultHeader} />
          {children}
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}

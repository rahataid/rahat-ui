'use client';

import * as React from 'react';
import { Nav } from '../../components/nav';
import AuthGuard from '../../guards/auth-guard';
import SideNav from '../../components/side-nav';

export default function DashboardLayout({
  children,
  hasDefaultHeader = true,
}: {
  children: React.ReactNode;
  hasDefaultHeader?: boolean;
}) {
  return (
    <AuthGuard>
      <div className="flex">
        <SideNav />
        <div className="w-full h-screen">
          <Nav hasDefaultHeader={hasDefaultHeader} />
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}

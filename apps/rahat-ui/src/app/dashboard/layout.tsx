'use client';

import * as React from 'react';
import { Nav } from '../../components/nav';
import AuthGuard from '../../guards/auth-guard';
import SideNav from '../../components/side-nav';

export default function DashboardLayout({
  margin = 'mt-14',
  children,
  hasDefaultHeader = true,
}: {
  margin?: string;
  children: React.ReactNode;
  hasDefaultHeader?: boolean;
}) {
  return (
    <AuthGuard>
      <div className="flex">
        {hasDefaultHeader && <SideNav />}
        <div className="w-full h-screen">
          <Nav hasDefaultHeader={hasDefaultHeader} />
          <div className={margin}>{children}</div>
        </div>
      </div>
    </AuthGuard>
  );
}

'use client';

import * as React from 'react';
import { Nav } from './nav';
import AuthGuard from '../guards/auth-guard';
import SideNav from './side-nav';

export default function DashboardShell({
  children,
  hasDefaultHeader = true,
  margin = 'mt-14',
}: {
  children: React.ReactNode;
  hasDefaultHeader?: boolean;
  margin?: string;
}) {
  return (
    <AuthGuard>
      <div className="flex">
        {hasDefaultHeader && <SideNav />}
        <div className="w-full h-screen">
          <Nav hasDefaultHeader={hasDefaultHeader} />
          <div className={`border-0 bg-green ${margin}`}>
            {children}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

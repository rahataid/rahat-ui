'use client';

import * as React from 'react';
import { Nav } from '../../components/nav';
import AuthGuard from '../../guards/auth-guard';
import SideNav from '../../components/side-nav';
import { cn } from '@rahat-ui/shadcn/src/utils';
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
        <div
          className={cn(
            'w-full',
            !hasDefaultHeader &&
              'flex h-svh min-h-0 w-full flex-col overflow-hidden',
          )}
        >
          <Nav hasDefaultHeader={hasDefaultHeader} />
          {children}
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}

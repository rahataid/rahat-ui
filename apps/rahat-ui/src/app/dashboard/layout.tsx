'use client';

import * as React from 'react';
import { Nav } from '../../components/nav';
import AuthGuard from '../../guards/auth-guard';
import {
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';

export default function DashboardLayout({
  children,
  hasDefaultHeader = true,
}: {
  children: React.ReactNode;
  hasDefaultHeader?: boolean;
}) {
  return (
    <AuthGuard>
      <title>Dashboard</title>
      {hasDefaultHeader && <Nav />}
      <div className="mx-2">
        <ResizablePanelGroup direction="horizontal" className="border">
          <ResizablePanel minSize={20} defaultSize={20} maxSize={20}>
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </AuthGuard>
  );
}

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
      <Nav hasDefaultHeader={hasDefaultHeader} />
      <div className="pl-14 pr-2">
        <ResizablePanelGroup direction="horizontal" className="shadow-lg">
          {/* Sidebar panel with proper width */}
          {/* <ResizablePanel minSize={20} defaultSize={20} maxSize={20}>
            <div className="bg-gray-100 p-4 h-full">
              Sidebar content
            </div>
          </ResizablePanel> */}

          {/* Main content area */}
          <ResizablePanel minSize={60} defaultSize={80} maxSize={80}>
            <div className="bg-white">{children}</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </AuthGuard>
  );
}

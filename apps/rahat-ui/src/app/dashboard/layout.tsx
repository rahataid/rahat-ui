'use client';

import * as React from 'react';
import { Nav } from '../../components/nav';
import AuthGuard from '../../guards/auth-guard';
import {
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
import { useAcessManagerSettings } from '@rahat-ui/query';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useAcessManagerSettings();
  return (
    <AuthGuard>
      <Nav />
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

'use client';

import * as React from 'react';
import { Nav } from '../../components/nav';
import AuthGuard from '../../guards/auth-guard';
import {
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
import { ScrollArea } from '@radix-ui/react-scroll-area';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Nav />
      <div className="mx-2">
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-max border"
        >
          <ResizablePanel
            minSize={20}
            defaultSize={20}
            maxSize={20}
            className="w-full bg-secondary"
          >
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </AuthGuard>
  );
}

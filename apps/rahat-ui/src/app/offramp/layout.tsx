'use client';

import * as React from 'react';
import { Nav } from '../../components/nav';
import AuthGuard from '../../guards/auth-guard';
import {
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';

export default function OfframpingLayout({
  children,
  hasDefaultHeader = true,
}: {
  children: React.ReactNode;
  hasDefaultHeader?: boolean;
}) {
  return (
    <AuthGuard>
      {hasDefaultHeader && <Nav />}
      <div className="mx-2">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel minSize={20} defaultSize={20} maxSize={20}>
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </AuthGuard>
  );
}

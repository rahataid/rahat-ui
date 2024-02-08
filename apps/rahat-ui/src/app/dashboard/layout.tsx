'use client';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/components/resizable';
import * as React from 'react';
import SideNav from '../../components/side-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen">
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
      >
        <ResizablePanel collapsible={true} minSize={2} maxSize={15}>
          <SideNav />
        </ResizablePanel>
        <ResizableHandle />
        {children}
        <ResizableHandle />
      </ResizablePanelGroup>
    </div>
  );
}

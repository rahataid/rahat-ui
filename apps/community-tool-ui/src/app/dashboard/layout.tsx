'use client';

import * as React from 'react';
import { Nav } from '../../components/nav';
import AuthGuard from '../../guards/auth-guard';
import { socket } from 'apps/community-tool-ui/src/socket';
import {
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
import { toast } from 'react-toastify';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    const handleGroupUpdated = (message: any) => {
      const { updatedCount, failedCount } = message;
      if (updatedCount > 0) {
        toast.success(
          `${updatedCount} beneficiar${
            updatedCount === 1 ? 'y' : 'ies'
          } updated successfully.`,
        );
      }
      if (failedCount > 0) {
        toast.error(
          `${failedCount} beneficiar${
            failedCount === 1 ? 'y' : 'ies'
          } failed to update.`,
        );
      }
    };
    socket.on('beneficiary-group-updated', handleGroupUpdated);
    return () => {
      socket.off('beneficiary-group-updated', handleGroupUpdated);
    };
  }, []);
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
            className="h-[calc(100vh-68px)] w-full bg-secondary"
          >
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </AuthGuard>
  );
}

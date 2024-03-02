'use client';
import { useState } from 'react';

import { Tabs, TabsContent } from '@rahat-ui/shadcn/components/tabs';
import DashboardSummary from './summary';
import {
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
import { DashboardCharts } from '.';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { DashboardRecentActivities } from './activities.dashboard';

export default function DashboardView() {
  return (
    <div>
      <Tabs defaultValue="list" className="">
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
            <ScrollArea className="h-[calc(100vh-68px)] px-6 py-4">
              <TabsContent value="list">
                <DashboardSummary />
                <DashboardCharts />
                <DashboardCharts />
              </TabsContent>
            </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Tabs>
    </div>
  );
}

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
      <Tabs defaultValue="list">
        <ScrollArea className="h-[calc(100vh-68px)] px-4 py-2">
          <TabsContent value="list">
            <DashboardSummary />
            <DashboardCharts />
            <DashboardCharts />
            <DashboardCharts />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}

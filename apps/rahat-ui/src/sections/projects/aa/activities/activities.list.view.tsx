'use client';

import ActivitiesTable from './activities.table';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import ActivitiesPhaseCard from './activities.phase.card';
import { useActivities, useActivitiesFieldStore } from '@rahat-ui/query';

export default function ActivitiesList() {
  const { secondPanel } = useSecondPanel();
  useActivities('45606343-e6f5-475f-a2b3-f31d6ab10733');
  const activities = useActivitiesFieldStore((state) => state.demoActivities);
  return (
    <>
      <ActivitiesPhaseCard />
      <ResizablePanelGroup className="bg-secondary" direction="horizontal">
        <ResizablePanel minSize={50}>
          <ActivitiesTable activitiesData={activities?.data} />
        </ResizablePanel>
        {secondPanel && (
          <>
            <ResizableHandle className="mt-2" withHandle />
            <ResizablePanel minSize={30} defaultSize={30}>
              {secondPanel}
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </>
  );
}

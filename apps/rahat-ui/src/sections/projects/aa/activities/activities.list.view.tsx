'use client';

import { useParams } from 'next/navigation';
import ActivitiesTable from './activities.table';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import ActivitiesPhaseCard from './activities.phase.card';
import { useActivities, useActivitiesStore } from '@rahat-ui/query';
import { UUID } from 'crypto';

export default function ActivitiesList() {
  const { secondPanel } = useSecondPanel();
  const { id } = useParams();
  useActivities(id as UUID);
  const activities = useActivitiesStore((state) => state.activities);
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

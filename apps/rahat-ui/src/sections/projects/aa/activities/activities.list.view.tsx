'use client';

import ActivitiesTable from './activities.table';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import ActivitiesPhaseCard from './activities.phase.card';

export default function ActivitiesList() {
  const { secondPanel } = useSecondPanel();

  return (
    <>
      <ActivitiesPhaseCard />
      <ResizablePanelGroup className="bg-secondary" direction="horizontal">
        <ResizablePanel minSize={50}>
          <ActivitiesTable />
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

'use client';

import ActivitiesTable from './activities.table';
import {
  ResizablePanelGroup,
  ResizablePanel,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import ActivitiesPhaseCard from './activities.phase.card';

export default function ActivitiesList() {
  const { secondPanel } = useSecondPanel();

  return (
    <>
      <ResizablePanelGroup className="bg-secondary" direction="horizontal">
        <ResizablePanel>
          <ActivitiesPhaseCard />
          <ActivitiesTable />
        </ResizablePanel>
        {secondPanel && secondPanel}
      </ResizablePanelGroup>
    </>
  );
}

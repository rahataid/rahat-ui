'use client';

import { useState } from 'react';
import ActivitiesTable from './activities.table';
import ActivitiesDetail from './activities.detail.view';
import {
  ResizablePanelGroup,
  ResizablePanel,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
import { IActivitiesItem } from 'apps/rahat-ui/src/types/activities';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import ActivitiesPhaseCard from './activities.phase.card';

export default function ActivitiesList() {
  const { secondPanel } = useSecondPanel();
  const [selectedActivity, setSelectedActivity] = useState<IActivitiesItem>();

  const handleClose = () => {
    setSelectedActivity(undefined);
  };

  return (
    <>
      <ResizablePanelGroup className="bg-secondary" direction="horizontal">
        <ResizablePanel>
          <ActivitiesPhaseCard />
          <ActivitiesTable />
        </ResizablePanel>

        {secondPanel && (
          <ResizablePanel defaultSize={32}>
            <ActivitiesDetail closeSecondPanel={handleClose} />
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    </>
  );
}

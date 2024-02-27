'use client';
import { useState } from 'react';
import {
  ResizablePanelGroup,
  ResizableHandle,
  ResizablePanel,
} from '@rahat-ui/shadcn/components/resizable';

import { Nav } from '../nav';
import TextTableView from './textTable';
import AddCampaign from './addCampaign';

import { COMMUNICATION_NAV_ROUTE } from 'apps/rahat-ui/src/const/communication.const';

export default function TextView() {
  const [activeTab, setActiveTab] = useState<string>(
    COMMUNICATION_NAV_ROUTE.DEFAULT_TEXT
  );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  return (
    <div>
      <div className="mb-9 mt-8">
        <h1 className="text-3xl font-semibold">Communication: Text</h1>
      </div>
      <ResizablePanelGroup direction="horizontal" className="min-h-max border">
        <ResizablePanel
          minSize={17}
          defaultSize={17}
          maxSize={17}
          className="h-full"
        >
          <Nav onTabChange={handleTabChange} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={28}>
          {/* show tableview by default  */}
          {activeTab === COMMUNICATION_NAV_ROUTE.DEFAULT_TEXT && (
            <TextTableView />
          )}
          {activeTab === COMMUNICATION_NAV_ROUTE.ADD_TEXT_CAMPAIGN && (
            <AddCampaign />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

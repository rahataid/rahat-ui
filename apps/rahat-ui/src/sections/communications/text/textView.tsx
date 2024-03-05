'use client';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/components/resizable';
import { useState } from 'react';

import CommunicationNav from '../nav';
import AddCampaign from './addCampaign';
import TextTableView from './textTable';

import { COMMUNICATION_NAV_ROUTE } from 'apps/rahat-ui/src/constants/communication.const';

export default function TextView() {
  const [activeTab, setActiveTab] = useState<string>(
    COMMUNICATION_NAV_ROUTE.DEFAULT_TEXT
  );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  return (
    <div>
      <ResizablePanelGroup direction="horizontal" className="min-h-max border">
        <ResizablePanel
          minSize={17}
          defaultSize={17}
          maxSize={17}
          className="h-full"
        >
          <CommunicationNav onTabChange={handleTabChange} title="Text" />
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

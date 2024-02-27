'use client';
import { useState } from 'react';

import {
  ResizablePanelGroup,
  ResizableHandle,
  ResizablePanel,
} from '@rahat-ui/shadcn/components/resizable';
import { Nav } from '../nav';
import VoiceTableView from './voiceTable';
import { COMMUNICATION_NAV_ROUTE } from 'apps/rahat-ui/src/const/communication.const';
import AddCampaign from '../text/addCampaign';

export default function VoiceView() {
  const [activeTab, setActiveTab] = useState<string>(
    COMMUNICATION_NAV_ROUTE.DEFAULT_VOICE
  );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  return (
    <div>
      <div className="mb-9 mt-8">
        <h1 className="text-3xl font-semibold">Communication: Voice</h1>
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
          {activeTab === COMMUNICATION_NAV_ROUTE.DEFAULT_VOICE && (
            <VoiceTableView />
          )}
          {activeTab === COMMUNICATION_NAV_ROUTE.ADD_TEXT_CAMPAIGN && (
            <AddCampaign />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

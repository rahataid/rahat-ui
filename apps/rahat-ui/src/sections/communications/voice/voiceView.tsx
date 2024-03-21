'use client';
import { useState } from 'react';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/components/resizable';
import { COMMUNICATION_NAV_ROUTE } from 'apps/rahat-ui/src/constants/communication.const';
import CommunicationNav from '../nav';
import AddCampaign from '../add/addCampaign';
import VoiceTableView from './voiceTable';

export default function VoiceView() {
  const [activeTab, setActiveTab] = useState<string>(
    COMMUNICATION_NAV_ROUTE.DEFAULT_VOICE,
  );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  return (
    <div className="h-full">
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-max border bg-card"
      >
        <ResizablePanel
          minSize={17}
          defaultSize={17}
          maxSize={17}
          className="h-full"
        >
          <CommunicationNav onTabChange={handleTabChange} title="Voice" />
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

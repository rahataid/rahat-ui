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
import { ICampaignItemApiResponse } from '@rahat-ui/types';
import TextDetailSplitView from './text.detail.split.view';

export default function TextView() {
  const [activeTab, setActiveTab] = useState<string>(
    COMMUNICATION_NAV_ROUTE.DEFAULT_TEXT,
  );
  const [selected, setSelected] = useState<ICampaignItemApiResponse>();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleCommunicationClick = (selected: ICampaignItemApiResponse) => {
    setSelected(selected);
  };

  const handleCloseSplitView = () => {
    setSelected(undefined);
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
          <CommunicationNav onTabChange={handleTabChange} title="Text" />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={28}>
          {/* show tableview by default  */}
          {activeTab === COMMUNICATION_NAV_ROUTE.DEFAULT_TEXT && (
            <TextTableView handleClick={handleCommunicationClick} />
          )}
          {activeTab === COMMUNICATION_NAV_ROUTE.ADD_TEXT_CAMPAIGN && (
            <AddCampaign />
          )}
        </ResizablePanel>
        {selected && (
          <ResizablePanel defaultSize={28}>
            <TextDetailSplitView
              data={selected}
              handleClose={handleCloseSplitView}
            />
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    </div>
  );
}

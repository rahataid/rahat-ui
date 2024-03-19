'use client';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/components/resizable';
import { useState } from 'react';
import TextTable from './textTable';

import { ICampaignItemApiResponse } from '@rahat-ui/types';
import TextDetailSplitView from './text.detail.split.view';

export default function TextMainView() {
  const [selected, setSelected] = useState<ICampaignItemApiResponse>();

  const handleCommunicationClick = (selected: ICampaignItemApiResponse) => {
    setSelected(selected);
  };

  const handleCloseSplitView = () => {
    setSelected(undefined);
  };
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel minSize={50}>
        <TextTable handleClick={handleCommunicationClick} />
      </ResizablePanel>
      {selected && (
        <>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40}>
            <TextDetailSplitView
              data={selected}
              handleClose={handleCloseSplitView}
            />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
}

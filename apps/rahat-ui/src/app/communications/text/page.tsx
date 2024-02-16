'use client';

import {
  ResizablePanelGroup,
  ResizableHandle,
  ResizablePanel,
} from '@rahat-ui/shadcn/components/resizable';
import CommunicationNav from '../../../components/communications/nav';
import TextTableView from 'apps/rahat-ui/src/components/communications/textTable';

export default function VoicePage() {
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
          <CommunicationNav />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={28}>
          <TextTableView />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

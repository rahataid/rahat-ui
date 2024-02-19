'use client';

import {
  ResizablePanelGroup,
  ResizableHandle,
  ResizablePanel,
} from '@rahat-ui/shadcn/components/resizable';
import CommunicationNav from './nav';
import TextTableView from './textTable';

export default function TextView() {
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

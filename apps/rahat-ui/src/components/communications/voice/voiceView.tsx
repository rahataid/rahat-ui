'use client';

import {
  ResizablePanelGroup,
  ResizableHandle,
  ResizablePanel,
} from '@rahat-ui/shadcn/components/resizable';
import CommunicationNav from '../nav';
import VoiceTableView from './voiceTable';

export default function VoiceView() {
  return (
    <div>
      <div className="my-4">
        <h1 className="text-3xl font-semibold">Communication: Voice</h1>
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
          <VoiceTableView />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

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
    <div className="mt-4">
      <ResizablePanelGroup direction="horizontal" className="min-h-max border">
        <ResizablePanel
          minSize={17}
          defaultSize={17}
          maxSize={17}
          className="h-full"
        >
          <CommunicationNav title="Voice" />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={28}>
          <VoiceTableView />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

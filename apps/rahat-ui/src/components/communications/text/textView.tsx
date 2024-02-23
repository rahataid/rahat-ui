'use client';

import {
  ResizablePanelGroup,
  ResizableHandle,
  ResizablePanel,
} from '@rahat-ui/shadcn/components/resizable';
import CommunicationNav from '../nav';
import TextTableView from './textTable';

export default function TextView() {
  return (
    <div className='mt-2'>
      <ResizablePanelGroup direction="horizontal" className="min-h-max border">
        <ResizablePanel
          minSize={17}
          defaultSize={17}
          maxSize={17}
          className="h-full"
        >
          <CommunicationNav title='Text' />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={28}>
          <TextTableView />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

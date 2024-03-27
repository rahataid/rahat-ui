'use client';
import { Tabs } from '@rahat-ui/shadcn/components//tabs';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/components/resizable';
import VendorsTable from '../../sections/vendors/vendors.list.table';
import VendorNav from '../../sections/vendors/nav';
import { useSecondPanel } from '../../providers/second-panel-provider';

export default function VendorsPage() {
  const { secondPanel } = useSecondPanel();
  return (
    <div className="mt-2">
      <Tabs defaultValue="grid">
        <ResizablePanelGroup direction="horizontal" className="min-h-max">
          <ResizablePanel
            minSize={20}
            defaultSize={20}
            maxSize={20}
            className="bg-card"
          >
            <VendorNav />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel minSize={35} defaultSize={60} maxSize={60}>
            <VendorsTable />
          </ResizablePanel>

          {secondPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={60} maxSize={60}>
                {secondPanel}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </Tabs>
    </div>
  );
}

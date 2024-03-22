import { Tabs } from '@rahat-ui/shadcn/components//tabs';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/components/resizable';
import VendorsTable from '../../sections/vendors/vendorsTable';
import VendorNav from '../../sections/vendors/nav';

export default function VendorsPage() {
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
          <ResizablePanel>
            <VendorsTable />
          </ResizablePanel>
        </ResizablePanelGroup>
      </Tabs>
    </div>
  );
}

import { Tabs } from '@rahat-ui/shadcn/components//tabs';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/components/resizable';
import ProjectNav from '../../sections/projects/nav';
import VendorsTable from '../../sections/vendors/vendorsTable';

export default function VendorsPage() {
  return (
    <div className="mt-4">
      <Tabs defaultValue="grid">
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-max border"
        >
          <ResizablePanel
            minSize={20}
            defaultSize={20}
            maxSize={20}
            className="h-full"
          >
            <ProjectNav title="Vendors" />
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

import ProjectNav from '../../components/projects/nav';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/components/resizable';
import { Tabs } from '@rahat-ui/shadcn/components//tabs';
import VendorsTable from '../../components/vendors/vendorsTable';

export default function VendorsPage() {
  return (
    <div className="mb-5">
      <Tabs defaultValue="grid">
        <div className="flex items-center justify-between mb-9 mt-8">
          <h1 className="text-3xl font-semibold">Vendors List</h1>
        </div>
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
            <ProjectNav />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>
            <div className="p-4">
              <VendorsTable />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Tabs>
    </div>
  );
}

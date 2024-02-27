import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/components/resizable';
import { Tabs } from '@rahat-ui/shadcn/components/tabs';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import ProjectDetailsNav from '../../../sections/projects/prjectDetailsNav';
import ProjectDetails from './projectDetails';

export default function ProjectPage() {
  return (
    <div className="mb-5">
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
            <ProjectDetailsNav title={'Project Details'} />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>
            <ScrollArea className="h-custom">
              <ProjectDetails />
            </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Tabs>
    </div>
  );
}

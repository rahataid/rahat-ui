import projectsData from './projectsData.json';
import ProjectNav from '../../components/projects/nav';
import ProjectCards from '../../components/projects/projectCard';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/components/resizable';
import { Tabs } from '@rahat-ui/shadcn/components//tabs';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

type CardProps = {
  id: number;
  title: string;
  subTitle: string;
  handleClick: VoidFunction;
};

export default function ProjectPage({ handleClick }: CardProps) {
  return (
    <div className="mb-5">
      <Tabs defaultValue="grid">
        <div className="flex items-center justify-between my-4">
          <h1 className="text-3xl font-semibold">Projects List</h1>
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
            <ScrollArea className="h-custom">
              <div className="grid grid-cols-4 gap-8 p-4">
                {projectsData.map((project) => (
                  <ProjectCards
                    id={project.id}
                    key={project.id}
                    title={project.title}
                    subTitle={project.subTitle}
                    handleClick={handleClick}
                  />
                ))}
              </div>
            </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Tabs>
    </div>
  );
}

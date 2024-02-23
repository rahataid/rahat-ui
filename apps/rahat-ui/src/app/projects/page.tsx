import { Tabs } from '@rahat-ui/shadcn/components//tabs';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/components/resizable';
import ProjectNav from '../../components/projects/nav';
import ProjectCards from '../../components/projects/projectCard';
import projectsData from './projectsData.json';

interface CardProps {
  id: number;
  title: string;
  subTitle: string;
  handleClick: VoidFunction;
}

export default function ProjectPage({ handleClick }: CardProps) {
  return (
    <div className="mb-5">
      <Tabs defaultValue="grid">
        <div className="flex items-center justify-between mb-9 mt-8">
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
            <div className="sm:flex gap-4 p-4">
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
          </ResizablePanel>
        </ResizablePanelGroup>
      </Tabs>
    </div>
  );
}

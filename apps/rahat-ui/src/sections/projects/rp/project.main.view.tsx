'use client';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import RPProjectDetails from './project.detail';
import { useProjectStore } from '@rahat-ui/query';

const ProjectMainView = () => {
  const project = useProjectStore((state) => state.singleProject);

  return (
    <>
      <div className="p-2 bg-secondary">
        <ScrollArea className="h-[calc(100vh-80px)]">
          <RPProjectDetails project={project} />
        </ScrollArea>
      </div>
    </>
  );
};

export default ProjectMainView;

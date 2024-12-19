'use client';

import { useProjectStore } from '@rahat-ui/query';
import CommsProjectDetails from './project.detail';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';


const ProjectMainView = () => {
  const project = useProjectStore((state) => state.singleProject);

  return (
    <>
      <div className="p-2 bg-secondary">
        <ScrollArea className="h-[calc(100vh-80px)]">
          <CommsProjectDetails project={project ? project:{}} />
        </ScrollArea>
      </div>
    </>
  );
};

export default ProjectMainView;

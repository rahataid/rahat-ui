'use client';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { useProjectStore } from '@rahat-ui/query';
import ELKenyaProjectDetail from './project.detail';

const ProjectMainView = () => {
  const project = useProjectStore((state) => state.singleProject);

  return (
    <div className="p-4">
      <div>
        <h1 className="font-semibold text-[28px] mb-2">
          Welcome to CVA Dashboard
        </h1>
        <p className="text-muted-foreground text-base">
          Your Hub for Real-Time Analytics and Data Visualization of the system
        </p>
      </div>
      <ScrollArea className="mt-5 h-[calc(100vh-185px)]">
        <ELKenyaProjectDetail />
      </ScrollArea>
    </div>
  );
};

export default ProjectMainView;

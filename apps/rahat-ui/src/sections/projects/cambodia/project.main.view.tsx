'use client';
import React from 'react';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { useProjectStore } from '@rahat-ui/query';
import ProjectDetail from './project.detail';

const ProjectMainView = () => {
  const project = useProjectStore((state) => state.singleProject);

  return (
    <div className="p-4">
      <div>
        <h1 className="font-semibold text-[28px] mb-2">Welcome to Dashboard</h1>
        <p className="text-muted-foreground text-base">
          Your Hub for Real-Time Analytics and Data VIsualization of the system
        </p>
      </div>
      <ScrollArea className="mt-5 h-[calc(100vh-185px)]">
        <ProjectDetail />
      </ScrollArea>
    </div>
  );
};

export default ProjectMainView;

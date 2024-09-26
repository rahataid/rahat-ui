'use client';
import React from 'react';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { useProjectStore } from '@rahat-ui/query';

const ProjectMainView = () => {
  const project = useProjectStore((state) => state.singleProject);

  return (
    <div className="p-4 bg-secondary h-[calc(100vh-65px)]">
      <div>
        <h1 className="font-semibold text-2xl mb-2">
          Welcome to CVA Dashboard
        </h1>
        <p className="text-muted-foreground">
          Your Hub for Real-Time Analytics and Data VIsualization of the system
        </p>
      </div>
      <ScrollArea className="mt-5 h-[calc(100vh-175px)]">Cambodia</ScrollArea>
    </div>
  );
};

export default ProjectMainView;

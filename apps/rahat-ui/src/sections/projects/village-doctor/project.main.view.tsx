'use client';
import React from 'react';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { useProjectStore } from '@rahat-ui/query';
import ProjectDetail from './project.detail';

const ProjectMainView = () => {
  const project = useProjectStore((state) => state.singleProject);

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="border-b border-border/80 bg-card/95 px-6 py-6 shadow-sm shadow-black/[0.03] backdrop-blur supports-[backdrop-filter]:bg-card/90">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
          Project overview
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-[28px] sm:leading-tight">
          Welcome to the dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Live analytics and data visualizations for {project?.name ?? 'this'}{' '}
          program.
        </p>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="p-6">
          <ProjectDetail />
        </div>
      </ScrollArea>
    </div>
  );
};

export default ProjectMainView;

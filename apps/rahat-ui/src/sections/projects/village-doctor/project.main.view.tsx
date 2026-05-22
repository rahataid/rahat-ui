'use client';
import React from 'react';
import { useProjectStore } from '@rahat-ui/query';
import ProjectDetail from './project.detail';

const ProjectMainView = () => {
  const project = useProjectStore((state) => state.singleProject);

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="border-b border-border/80 bg-card/95 px-6 py-5 shadow-sm shadow-black/[0.03] backdrop-blur supports-[backdrop-filter]:bg-card/90">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Welcome to the dashboard
        </h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Live analytics and data visualizations for{' '}
          {project?.name ?? 'this'} program.
        </p>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <ProjectDetail />
      </div>
    </div>
  );
};

export default ProjectMainView;

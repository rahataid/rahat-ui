'use client';
import React from 'react';
import { useProjectStore } from '@rahat-ui/query';
import ProjectDetail from './project.detail';
import { VillageDoctorPageShell } from './page-shell';

const ProjectMainView = () => {
  const project = useProjectStore((state) => state.singleProject);

  return (
    <VillageDoctorPageShell
      title="Welcome to the dashboard"
      subtitle={`Live analytics and data visualizations for ${project?.name ?? 'this'} program.`}
    >
      <ProjectDetail />
    </VillageDoctorPageShell>
  );
};

export default ProjectMainView;

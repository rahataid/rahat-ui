'use client';

import type { Metadata } from 'next';
import { ProjectChart } from '..';
import ProjectDataCard from './project.datacard';
import ProjectInfo from './project.info';

export const metadata: Metadata = {
  title: 'DashBoard',
};

const ProjectDetails = () => {
  return (
    <div className="p-2 bg-secondary">
      <ProjectInfo />
      <ProjectDataCard />
      <ProjectChart />
    </div>
  );
};

export default ProjectDetails;

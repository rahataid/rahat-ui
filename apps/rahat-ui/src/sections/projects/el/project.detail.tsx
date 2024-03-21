'use client';

import type { Metadata } from 'next';
import { ProjectChart } from '..';
import ProjectDataCard from './project.datacard';
import ProjectInfo from './project.info';
import { useProjectAction } from 'libs/query/src/lib/projects/projects';
import { useEffect } from 'react';
import { getProjectAddress } from 'apps/rahat-ui/src/utils/getProjectAddress';

export const metadata: Metadata = {
  title: 'DashBoard',
};

const ProjectDetails = () => {
  
  const uuid = process.env.NEXT_PUBLIC_PROJECT_UUID;
  const getProject = useProjectAction();

  const fetchAddress = async () => {
    try {
      const address = await getProjectAddress(getProject, uuid);
      console.log(address)
    } catch (error) {
      console.error('Error fetching project address:', error);
    }
  };

  useEffect(() => {
    fetchAddress()
  }, [])



  return (
    <div className="p-2 bg-secondary">
      <ProjectInfo />
      <ProjectDataCard />
      <ProjectChart />
    </div>
  );
};

export default ProjectDetails;

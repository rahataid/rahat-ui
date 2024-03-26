'use client';

import type { Metadata } from 'next';
import { ProjectChart } from '..';
import ProjectDataCard from './project.datacard';
import ProjectInfo from './project.info';
import { useProjectAction } from 'libs/query/src/lib/projects/projects';
import { useEffect } from 'react';
import { getProjectAddress } from 'apps/rahat-ui/src/utils/getProjectAddress';
import * as React from 'react';

export const metadata: Metadata = {
  title: 'DashBoard',
};

const ProjectDetails = () => {
  // Remove fetching uuid from env
  const uuid = process.env.NEXT_PUBLIC_PROJECT_UUID;
  const getProject = useProjectAction();
  const [contractSettings, setContractSettings] = React.useState({});

  const fetchAddress = async () => {
    try {
      const address = await getProjectAddress(getProject, uuid);
      setContractSettings(address.value);
    } catch (error) {
      console.error('Error fetching project address:', error);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  return (
    <div className="p-2 bg-secondary">
      <ProjectInfo />
      <ProjectDataCard contractSettings={contractSettings} />
      <ProjectChart />
    </div>
  );
};

export default ProjectDetails;

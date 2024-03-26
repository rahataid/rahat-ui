'use client';

import type { Metadata } from 'next';
import { ProjectChart } from '..';
import ProjectDataCard from './project.datacard';
import ProjectInfo from './project.info';
import { useProjectAction } from 'libs/query/src/lib/projects/projects';
import { useEffect, useState } from 'react';
import { getProjectAddress } from 'apps/rahat-ui/src/utils/getProjectAddress';
import * as React from 'react';
import {
  useBeneficiaryCount,
  useProjectVoucher,
} from 'apps/rahat-ui/src/hooks/el/subgraph/querycall';
import { useParams } from 'next/navigation';

export const metadata: Metadata = {
  title: 'DashBoard',
};

const ProjectDetails = () => {
  // Remove fetching uuid from env
  const { id } = useParams();
  const getProject = useProjectAction();
  const [contractSettings, setContractSettings] = useState<Record<string, any>>(
    {},
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const address = await getProjectAddress(getProject, id as string);
        setContractSettings(address.value);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching project address:', error);
      }
    };

    fetchAddress();
  }, []);

  const { data: projectVoucher } = useProjectVoucher(
    !isLoading ? contractSettings?.elproject?.address : null,
    !isLoading ? contractSettings?.eyevoucher?.address : null,
  );

  const { data: beneficiaryDetails } = useBeneficiaryCount(
    !isLoading ? contractSettings?.elproject?.address : null,
  );

  if (isLoading) {
    return <div>Loading Project Settings...</div>;
  }

  return (
    <div className="p-2 bg-secondary">
      <ProjectInfo />
      <ProjectDataCard
        beneficiaryDetails={beneficiaryDetails}
        projectVoucher={projectVoucher}
      />
      <ProjectChart />
    </div>
  );
};

export default ProjectDetails;

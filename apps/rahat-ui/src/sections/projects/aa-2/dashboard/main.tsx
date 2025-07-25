'use client';

import { Heading } from 'apps/rahat-ui/src/common';
import { useState } from 'react';
import BeneficiaryDemographics from './component/beneficiaryDemographics';
import CommunicationAnalytics from './component/communicationAnalytics';
import ResilienceOverview from './component/resilienceOverview';
import SocialProtectionBenefits from './component/socialProtectionBenefits';
import {
  useAAStations,
  useProjectInfo,
  useProjectStore,
} from '@rahat-ui/query';
import { Project } from '@rahataid/sdk/project/project.types';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';

const Main = () => {
  const project = useProjectStore((state) => state.singleProject) as Project;
  console.log(project);
  const { id } = useParams();
  const projectId = id as UUID;
  useAAStations(projectId);

  useProjectInfo(projectId);
  return (
    <div className="space-y-3 p-5">
      <Heading
        title="Project Dashboard"
        description="Overview of your system"
        titleStyle={'text-xl xl:text-3xl'}
      />

      <ResilienceOverview />
      <BeneficiaryDemographics />
      <SocialProtectionBenefits />
      <CommunicationAnalytics />
    </div>
  );
};

export default Main;

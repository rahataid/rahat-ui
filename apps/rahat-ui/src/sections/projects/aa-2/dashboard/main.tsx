'use client';

import { Heading } from 'apps/rahat-ui/src/common';
import { useState } from 'react';
import BeneficiaryDemographics from './component/beneficiaryDemographics';
import CommunicationAnalytics from './component/communicationAnalytics';
import ResilienceOverview from './component/resilienceOverview';
import SocialProtectionBenefits from './component/socialProtectionBenefits';
import {
  useAAStations,
  useProjectDashboardReporting,
  useProjectInfo,
  useProjectStore,
  useStellarSettings,
} from '@rahat-ui/query';
import { Project } from '@rahataid/sdk/project/project.types';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import DashboardSkeleton from './dashboard.skeleton';

const Main = () => {
  const project = useProjectStore((state) => state.singleProject) as Project;
  console.log(project);
  const { id } = useParams();
  const projectId = id as UUID;

  useAAStations(projectId);
  useProjectInfo(projectId);
  useStellarSettings(projectId);


  const { data, isLoading } = useProjectDashboardReporting(projectId);
  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-3 p-5">
      <Heading
        title="Project Dashboard"
        description="Overview of your system"
        titleStyle={'text-xl xl:text-3xl'}
      />

      <ResilienceOverview
        benefStats={data?.benefStats}
        triggeersStats={data?.triggeersStats}
        projectId={projectId}
      />
      <BeneficiaryDemographics
        benefStats={data?.benefStats}
        triggeersStats={data?.triggeersStats}
        projectId={projectId}
      />
      <SocialProtectionBenefits
        benefStats={data?.benefStats}
        triggeersStats={data?.triggeersStats}
        projectId={projectId}
      />

      <CommunicationAnalytics
        benefStats={data?.benefStats}
        triggeersStats={data?.triggeersStats}
        projectId={projectId}
      />
    </div>
  );
};

export default Main;

'use client';

import {
  useAAStations,
  useProjectDashboardBeneficiaryMapLocation,
  useProjectDashboardReporting,
  useProjectInfo,
  useStellarSettings,
} from '@rahat-ui/query';
import { Heading } from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import BeneficiaryDemographics from './component/beneficiaryDemographics';
import CommunicationAnalytics from './component/communicationAnalytics';
import MapView from './component/mapView';
import ResilienceOverview from './component/resilienceOverview';
import SocialProtectionBenefits from './component/socialProtectionBenefits';
import DashboardSkeleton from './dashboard.skeleton';
import DigitalAccessOverview from './component/digitalAccessOverview';
import AccessAndResilienceOverview from './component/accessPieAndBar';

const Main = () => {
  const { id } = useParams();
  const projectId = id as UUID;

  useAAStations(projectId);
  useStellarSettings(projectId);
  useProjectInfo(projectId);

  const { data, isLoading } = useProjectDashboardReporting(projectId);

  if (isLoading) return <DashboardSkeleton />;

  return (
    <>
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
        <DigitalAccessOverview stats={data?.benefStats} />
        <AccessAndResilienceOverview data={data?.benefStats} />
        <CommunicationAnalytics
          benefStats={data?.benefStats}
          triggeersStats={data?.triggeersStats}
          projectId={projectId}
        />
        <div className="mb-2 h-full w-full">
          <MapView projectId={projectId} benefStats={data?.benefStats} />
        </div>
      </div>
    </>
  );
};

export default Main;

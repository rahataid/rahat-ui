'use client';

import {
  useBackFill,
  useProjectDashboardReporting,
  useProjectInfo,
  useStellarSettings,
} from '@rahat-ui/query';
import { Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
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
import { RefreshCcw } from 'lucide-react';

const Main = () => {
  const { id } = useParams();
  const projectId = id as UUID;

  // useAAStations(projectId);
  useStellarSettings(projectId);
  const { data: projectInfo, isPending: isProjectInfoLoading } =
    useProjectInfo(projectId);

  const projectType = projectInfo?.value.project_type;
  const { data, isLoading } = useProjectDashboardReporting(
    projectId,
    projectType,
  );
  const { mutate: syncStats, isPending: isSyncing } = useBackFill(projectId);

  const handleBackFill = () => {
    syncStats();
  };

  if (isProjectInfoLoading || isLoading) return <DashboardSkeleton />;

  return (
    <>
      <div className="space-y-3 p-5">
        <div className="flex justify-between">
          <Heading
            title="Project Dashboard"
            description="Overview of your system"
            titleStyle={'text-xl xl:text-3xl'}
          />
          <IconLabelBtn
            name={isSyncing ? 'Updating' : 'Sync Stats'}
            Icon={RefreshCcw}
            handleClick={handleBackFill}
            variant="outline"
            className="text-[clamp(11px,1vw,14px)] h-[clamp(28px,3vw,36px)] px-2 sm:px-3"
          />
        </div>

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

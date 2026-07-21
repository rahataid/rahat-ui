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
import DashboardSkeleton from './dashboard.skeleton';
import { RefreshCcw } from 'lucide-react';
import DashboardTabs from './component/dashboard.tabs';

const Main = () => {
  const { id } = useParams();
  const projectId = id as UUID;

  useStellarSettings(projectId);
  const { data: projectInfo, isPending: isProjectInfoLoading } =
    useProjectInfo(projectId);

  const projectType = projectInfo?.value.project_type;
  const { data, isLoading } = useProjectDashboardReporting(projectId);
  const { mutate: syncStats, isPending: isSyncing } = useBackFill(projectId);

  if (isProjectInfoLoading || isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-4 p-5">
      <div className="flex justify-between">
        <Heading
          title="Project Dashboard"
          description="Overview of your system"
          titleStyle="text-xl xl:text-3xl"
        />
        <IconLabelBtn
          name={isSyncing ? 'Updating' : 'Sync Stats'}
          Icon={RefreshCcw}
          disabled={isSyncing}
          handleClick={() => syncStats()}
          variant="outline"
          className="text-[clamp(11px,1vw,14px)] h-[clamp(28px,3vw,36px)] px-2 sm:px-3"
        />
      </div>

      <DashboardTabs
        benefStats={data?.benefStats ?? []}
        triggeersStats={data?.triggeersStats ?? []}
        tokenStats={data?.tokenStats}
        projectId={projectId}
        projectType={projectType}
      />
    </div>
  );
};

export default Main;

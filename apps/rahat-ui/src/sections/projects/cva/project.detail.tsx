import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
  useReadRahatTokenBalanceOf,
} from '@rahat-ui/query';
import { Project } from '@rahataid/sdk/project/project.types';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { renderProjectDetailsExtras } from 'apps/rahat-ui/src/utils/render-extras';
import { UUID } from 'crypto';
import { CircleDollarSign, Users } from 'lucide-react';
import { useParams } from 'next/navigation';
import { FC } from 'react';
import { formatEther } from 'viem';

type ProjectInfoProps = {
  project: Project;
};

const ProjectInfo: FC<ProjectInfoProps> = ({ project }) => {
  const { id } = useParams() as { id: UUID };
  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );

  //temp contract call
  const tokenBalance = useReadRahatTokenBalanceOf({
    address: contractSettings?.rahattoken.address as `0x${string}`,
    args: [contractSettings?.cvaproject.address as `0x${string}`],
    query: {
      select(data) {
        return data ? formatEther(data) : 'N/A';
      },
    },
  });

  return (
    <div className="p-4 bg-slate-100">
      <div className="grid grid-cols-1 rounded-sm bg-card p-4 mb-2 shadow">
        <div>
          <p className="font-medium text-primary">{project?.name}</p>
        </div>
        <div className="flex items-center flex-wrap mt-4 sm:mt-6 gap-10 md:gap-32">
          {renderProjectDetailsExtras(project?.extras || {})}
          <div>
            <p className="font-medium text-primary">{project?.status}</p>
            <p className="font-light">Status</p>
          </div>
          <div>
            <p className="font-medium text-primary">{project?.type}</p>
            <p className="font-light">Type</p>
          </div>
        </div>
        <div>
          <p className="mt-4 sm:mt-8 sm:w-2/3">{project?.description}</p>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <DataCard
          className="h-40"
          title="Beneficiaries"
          number={'0'}
          Icon={Users}
          subTitle="Total"
        />
        <DataCard
          className=""
          title="Balance"
          subTitle="Total"
          number={tokenBalance.data}
          Icon={CircleDollarSign}
        />

        <DataCard
          className="h-40"
          title="Distributed"
          number={'0'}
          Icon={Users}
          subTitle="Total"
        />
      </div>
    </div>
  );
};

export default ProjectInfo;

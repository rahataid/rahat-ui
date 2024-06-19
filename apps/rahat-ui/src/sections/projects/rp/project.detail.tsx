import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
  useReadRahatTokenBalanceOf,
} from '@rahat-ui/query';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@rahat-ui/shadcn/src/components/ui/carousel';
import { Project } from '@rahataid/sdk/project/project.types';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import {
  renderProjectDetailsExtras,
  renderRowBasedProjectDetailsExtras,
} from 'apps/rahat-ui/src/utils/render-extras';
import { UUID } from 'crypto';
import {
  DollarSign,
  Users,
  AlignHorizontalSpaceAround,
  SmartphoneNfc,
} from 'lucide-react';
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
    address: contractSettings?.rahattoken?.address as `0x${string}`,
    args: [contractSettings?.rpproject?.address as `0x${string}`],
    query: {
      select(data) {
        return data ? formatEther(data) : 'N/A';
      },
    },
  });

  return (
    <div className="p-6 bg-slate-100">
      {/* DATACARD SECTION */}
      <div className="grid md:grid-cols-4 gap-2">
        <DataCard
          className="min-h-20 min-w-32 rounded-sm"
          title="Beneficiaries"
          number={'0'}
          Icon={Users}
        />
        <DataCard
          className="min-h-20 min-w-32 rounded-sm"
          title="Balance"
          number={tokenBalance.data || '0'}
          Icon={DollarSign}
        />
        <DataCard
          className="min-h-20 min-w-32 rounded-sm"
          title="Distributed"
          number={'0'}
          Icon={AlignHorizontalSpaceAround}
        />
        <DataCard
          className="min-h-20 min-w-32 rounded-sm"
          title="Total Campaigns"
          number={'0'}
          Icon={SmartphoneNfc}
        />
      </div>
      {/* CAROUSEL AND PROJECT INFO SECTION */}
      <div className="grid grid-cols-3 mt-2 bg-card p-3 rounded-sm h-[calc(100vh-282px)]">
        {/* CAROUSEL SECTION */}
        <div className="col-span-2 mr-4 rounded-sm mb-2">
          <Carousel>
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index}>
                  <div className="">
                    <img
                      className="rounded-sm object-cover min-h-96 min-w-full"
                      src={'/carousel.png'}
                      alt="carousel image"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <p className="font-normal text-gray-600 mt-2">
            {project?.description}
          </p>
        </div>
        {/* PROJECT INFO SECTION */}
        <div className="rounded-sm bg-slate-100 p-4 mb-2 shadow max-h-96">
          <div className="flex flex-col items-start flex-wrap mt-4 sm:mt-3 gap-10 md:gap-5">
            {renderRowBasedProjectDetailsExtras(project?.extras || {})}
            <div>
              <p className="font-normal text-neutral-400 text-sm">Status</p>
              <p className="font-normal text-base">{project?.status}</p>
            </div>
            <div>
              <p className="font-normal text-neutral-400 text-sm">Type</p>
              <p className="font-normal text-base">{project?.type}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;

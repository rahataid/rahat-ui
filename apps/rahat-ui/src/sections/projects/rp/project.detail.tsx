import { FC, useMemo } from 'react';
import { DynamicReports } from '../../chart-reports';
import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
  useReadRahatTokenBalanceOf,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { formatEther } from 'viem';
import tempReport from './temp_report.json';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@rahat-ui/shadcn/src/components/ui/carousel';
import { renderRowBasedProjectDetailsExtras } from 'apps/rahat-ui/src/utils/render-extras';
import { Project } from '@rahataid/sdk/project/project.types';
import Image from 'next/image';

type CarouselSectionProps = {
  description: string;
};

const CarouselSection: FC<CarouselSectionProps> = ({ description }) => (
  <div className="col-span-2 mr-4 rounded-sm mb-2">
    <Carousel>
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <Image
              className="rounded-sm object-cover min-w-full"
              src={'/carousel.png'}
              alt="carousel image"
              width={500} // Add the width property with an appropriate value
              height={500} // Add the height property with an appropriate value
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
    <p className="font-normal text-gray-600 mt-4">{description}</p>
  </div>
);

type ProjectInfoSectionProps = {
  project: Project;
};

const ProjectInfoSection: FC<ProjectInfoSectionProps> = ({ project }) => (
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
);

type ProjectInfoProps = {
  project: Project;
};

const ProjectInfo: FC<ProjectInfoProps> = ({ project }) => {
  const { id } = useParams() as { id: UUID };
  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );

  console.log({ contractSettings });

  const tokenBalance = useReadRahatTokenBalanceOf({
    address: contractSettings?.rahattoken?.address as `0x${string}`,
    args: [contractSettings?.rahatpayrollproject?.address as `0x${string}`],
    query: {
      select(data) {
        console.log('data', data);
        return data ? data : 'N/A';
      },
    },
  });

  const reportsChartsUI = useMemo(() => tempReport?.charts, []);
  const reportsChartsData = useMemo(
    () => [
      {
        name: 'BENEFICIARIES',
        data: `${process.env.NEXT_PUBLIC_API_HOST_URL}/v1/beneficiaries/stats`,
      },
    ],
    [],
  );

  const reportsCardsUI = useMemo(() => tempReport?.datacards, []);
  const reportsCardsData = useMemo(
    () => [
      { name: 'BENEFICIARIES', data: 0 },
      { name: 'BALANCE', data: Number(tokenBalance?.data) || 'N/A' },
      { name: 'DISTRIBUTED', data: 0 },
      { name: 'CAMPAIGNS', data: 0 },
    ],
    [tokenBalance.data],
  );

  return (
    <div className=" bg-slate-100">
      {/* DATACARD SECTION */}
      <DynamicReports data={reportsCardsData} ui={reportsCardsUI} />

      {/* CAROUSEL AND PROJECT INFO SECTION */}
      <div className="grid grid-cols-3 mt-2 bg-card p-3 rounded-sm">
        {/* CAROUSEL SECTION */}
        <CarouselSection description={project?.description as string} />
        {/* PROJECT INFO SECTION */}
        <ProjectInfoSection project={project} />
      </div>

      {/* CHARTS SECTION */}
      <DynamicReports data={reportsChartsData} ui={reportsChartsUI} />
    </div>
  );
};

export default ProjectInfo;

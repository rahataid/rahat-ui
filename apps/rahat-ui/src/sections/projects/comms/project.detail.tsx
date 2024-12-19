import {
  useGetProjectDatasource,
  useRPBeneficiaryCount,
} from '@rahat-ui/query';

import { FC } from 'react';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { DynamicReports } from '../../chart-reports';
import { Project } from '@rahataid/sdk/project/project.types';
import { renderRowBasedProjectDetailsExtras } from 'apps/rahat-ui/src/utils/render-extras';


type CarouselSectionProps = {
  description: string;
};

const CarouselSection: FC<CarouselSectionProps> = ({ description }) => (
  <div className="col-span-2 mr-4 rounded-sm mb-2">
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

  const { data } = useRPBeneficiaryCount(id);

  const newDatasource = useGetProjectDatasource(id);

  return (
    <div className=" bg-slate-100">
      {/* DATACARD SECTION */}
      {newDatasource?.data && newDatasource?.data[0]?.data?.ui.length && (
        <DynamicReports
          dataSources={newDatasource?.data[0]?.data?.dataSources}
          ui={newDatasource?.data[0]?.data?.ui}
        />
      )}

      {/* CAROUSEL AND PROJECT INFO SECTION */}
      <div className="grid grid-cols-3 mt-2 bg-card p-3 rounded-sm">
        {/* CAROUSEL SECTION */}
        <CarouselSection description={project?.description as string} />
        {/* PROJECT INFO SECTION */}
        {/* <ProjectInfoSection project={project} /> */}
      </div>

      {/* CHARTS SECTION */}
      {/* <DynamicReports data={reportsChartsData} ui={reportsChartsUI} /> */}
    </div>
  );
};

export default ProjectInfo;

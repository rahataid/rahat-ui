import { Project } from '@rahataid/sdk/project/project.types';
import { FC } from 'react';
import SmallDataCard from './project.datacard.small';

type ProjectInfoProps = {
  project: Project;
  totalVendor: any;
  loading: any;
  className?: any;
};

const ProjectInfo: FC<ProjectInfoProps> = ({
  project,
  totalVendor,
  loading,
}) => {
  const renderExtras = (extras: JSON | string | Record<string, string>) => {
    if (typeof extras === 'string') {
      return <p className="font-light">{extras}</p>;
    }
    return Object.keys(extras).map((key) => {
      return (
        <div key={key}>
          <p className="font-medium text-primary">{extras[key]}</p>
          <p className="font-light">{key}</p>
        </div>
      );
    });
  };
  return (
    <>
      <div className="grid grid-cols-5 gap-2 mb-2 ">
        <div className="col-span-4 rounded bg-card p-4 shadow">
          <div>
            <p className="font-medium text-primary">{project?.name}</p>
          </div>
          <div className="flex items-center flex-wrap mt-2 gap-10 md:gap-32">
            {renderExtras(project?.extras || {})}
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
            <p className="mt-2 sm:w-2/3">{project?.description}</p>
          </div>
        </div>
        <div className="col-span-1">
          <SmallDataCard
            className="h-full"
            title="Vendors"
            number={totalVendor}
            subTitle="Total Vendors"
            loading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default ProjectInfo;

import { Project } from '@rahataid/sdk/project/project.types';
import { FC } from 'react';

type ProjectInfoProps = {
  project: Project;
};

const ProjectInfo: FC<ProjectInfoProps> = ({ project }) => {
  console.log('project', project);
  const renderExtras = (extras: JSON | string | Record<string, any>) => {
    if (typeof extras === 'string') {
      return <p className="font-light">{extras}</p>;
    }
    return Object.keys(extras).map((key) => {
      const value = (extras as Record<string, any>)[key];

      if (key === 'treasury') {
        return null;
      }
      return (
        <div key={key}>
          {typeof value === 'object' && value !== null ? (
            renderExtras(value)
          ) : (
            <>
              <p className="font-medium text-primary">{key}</p>
              <p className="font-light">{String(value)}</p>
            </>
          )}
        </div>
      );
    });
  };
  return (
    <div className="grid grid-cols-1 rounded-sm bg-card p-4 mb-2 shadow">
      <div>
        <p className="font-medium text-primary">{project?.name}</p>
      </div>
      <div className="flex items-center flex-wrap mt-4 sm:mt-6 gap-10 md:gap-32">
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
        <p className="mt-4 sm:mt-8 sm:w-2/3">{project?.description}</p>
      </div>
    </div>
  );
};

export default ProjectInfo;

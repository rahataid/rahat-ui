import { Project } from '@rahataid/sdk/project/project.types';
import { FC } from 'react';

type ProjectInfoProps = {
  project: Project;
};

const ProjectInfo: FC<ProjectInfoProps> = ({ project }) => {
  console.log('project', project);

  return (
    <div className="grid grid-cols-1 rounded-sm bg-card p-6 mb-4 shadow">
      {/* Project Name - Assuming it comes from a project object as no specific name was provided */}
      <div>
        <h2 className="text-2xl font-semibold text-primary">{project?.name}</h2>
      </div>

      {/* Extras Section */}
      <div className="flex items-center flex-wrap mt-6 gap-12">
        <div className="min-w-[120px] flex flex-col gap-1">
          <p className="font-medium text-primary">
            {new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }).format(new Date(project?.extras?.startDate || new Date()))}
          </p>
          <p className="font-light text-sm">StartDate</p>
        </div>
        <div className="min-w-[120px] flex flex-col gap-1">
          <p className="font-medium text-primary">
            {project?.extras?.location}
          </p>
          <p className="font-light text-sm">Location</p>
        </div>

        <div className="min-w-[120px] flex flex-col gap-1">
          <p className="font-medium text-primary">
            {project?.extras?.projectManager}
          </p>
          <p className="font-light text-sm">ProjectManager</p>
        </div>

        {/* <div className="min-w-[120px] flex flex-col gap-1">
          <p className="font-medium text-primary">{project?.status}</p>
          <p className="font-light text-sm">Status</p>
        </div> */}
      </div>

      {/* Description - Included for completeness, assuming it comes from project object */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-2">Description</h3>
        <p className="text-gray-700">{project?.description}</p>
      </div>
    </div>
  );
};

export default ProjectInfo;

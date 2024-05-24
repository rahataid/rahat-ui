import { FC } from 'react';
import Image from 'next/image';
import { Project } from '@rahataid/sdk/project/project.types';
import EditButton from '../components/edit.btn';
import DeleteButton from '../components/delete.btn';
import Back from '../components/back';

type ProjectInfoProps = {
  project: Project;
};

const ProjectInfoCard = ({
  status,
  type,
  description,
}: {
  status: string;
  type: string;
  description: string;
}) => {
  return (
    <div className="w-full rounded bg-card p-4 shadow">
      <div className="flex flex-wrap gap-10 md:gap-32">
        <div>
          <p className="font-medium text-primary">{status}</p>
          <p className="font-light">Status</p>
        </div>
        <div>
          <p className="font-medium text-primary">{type}</p>
          <p className="font-light">Type</p>
        </div>
      </div>
      <div>
        <p className="mt-4">{description}</p>
      </div>
    </div>
  );
};

const ProjectInfo: FC<ProjectInfoProps> = ({ project }) => {
  const onDelete = () => {};
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Back path="/projects" />
          <h1 className="font-semibold text-xl">{project?.name}</h1>
        </div>
        <div className="flex gap-4 items-center">
          <EditButton path="/" />
          <DeleteButton name="project" handleContinueClick={onDelete} />
        </div>
      </div>
      <div className="flex gap-4 justify-between">
        <ProjectInfoCard
          status={project?.status ?? 'N/A'}
          type={project?.type ?? 'N/A'}
          description={project?.description ?? 'N/A'}
        />
        <Image
          className="rounded"
          src="/svg/aa-project.svg"
          alt="project"
          height={100}
          width={500}
        />
      </div>
    </>
  );
};

export default ProjectInfo;

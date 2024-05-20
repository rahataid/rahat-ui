import { FC } from 'react';
import Image from 'next/image';
import { Project } from '@rahataid/sdk/project/project.types';
import EditButton from '../components/edit.btn';
import DeleteButton from '../components/delete.btn';

type ProjectInfoProps = {
  project: Project;
};

const ProjectInfo: FC<ProjectInfoProps> = ({ project }) => {
  const onDelete = () => { }
  return (
    <>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='font-semibold text-xl'>{project?.name}</h1>
        <div className="flex gap-4 items-center">
          <EditButton path='/' />
          <DeleteButton name='project' handleContinueClick={onDelete} />
        </div>
      </div>
      <div className='grid grid-cols-5'>
        <p className='col-span-3'>{project?.description}</p>
        <Image
          className="col-span-2 w-full rounded"
          src='/svg/aa-project.svg'
          alt="project"
          height={100}
          width={500}
        />
      </div>
    </>
  );
};

export default ProjectInfo;

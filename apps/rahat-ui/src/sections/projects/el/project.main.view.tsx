'use client';

import { useParams } from 'next/navigation';
import ProjectDetails from './project.detail';
import { useProjectSettings } from '@rahat-ui/query';
import { UUID } from 'crypto';

const ProjectMainView = () => {
  const { id } = useParams();
  const projectSettings = useProjectSettings(id as UUID);

  console.log(projectSettings.data, 'projectSettings');

  return (
    <>
      <ProjectDetails />
    </>
  );
};

export default ProjectMainView;

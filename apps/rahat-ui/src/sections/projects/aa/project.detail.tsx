'use client';

import { useAAStations, useProjectStore } from '@rahat-ui/query';
import ProjectInfo from './project.info';
import { Project } from '@rahataid/sdk/project/project.types';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';

export default function ProjectDetails() {
  const project = useProjectStore((state) => state.singleProject) as Project;
  const {id} = useParams()
  useAAStations(id as UUID)

  return (
    <div className="p-4 bg-slate-100">
      <ProjectInfo project={project} />
    </div>
  );
}

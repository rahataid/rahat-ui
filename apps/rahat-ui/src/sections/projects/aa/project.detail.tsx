'use client';

import { useAAStations, usePhasesStats, useProjectStore, useStatsStore } from '@rahat-ui/query';
import ProjectInfo from './project.info';
import { Project } from '@rahataid/sdk/project/project.types';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { ActivitiesPhaseCard } from './activities';

export default function ProjectDetails() {
  const project = useProjectStore((state) => state.singleProject) as Project;
  const { id } = useParams()
  const projectID = id as UUID
  useAAStations(projectID)
  usePhasesStats(projectID)
  const { phasesStats } = useStatsStore()
  return (
    <div className="p-2 bg-secondary">
      <ProjectInfo project={project} />
      <ActivitiesPhaseCard phasesStats={phasesStats} />
    </div>
  );
}

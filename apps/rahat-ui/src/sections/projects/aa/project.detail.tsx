'use client';

import { useAAStations, useDhmWaterLevels, useProjectStore } from '@rahat-ui/query';
import ProjectInfo from './project.info';
import { Project } from '@rahataid/sdk/project/project.types';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import WaterLevelInfo from './waterlevel/waterlevel.info';
import { ActivitiesPhaseCard } from './activities';

export default function ProjectDetails() {
  const project = useProjectStore((state) => state.singleProject) as Project;
  const { id } = useParams()
  const projectID = id as UUID
  useAAStations(projectID)
  const { isLoading: isLoadingWaterLevels, data } = useDhmWaterLevels(projectID)

  console.log("water levels data", data)

  return (
    <div className="p-2 bg-secondary">
      <ProjectInfo project={project} />
      <ActivitiesPhaseCard />
      {/* {
        isLoadingWaterLevels? (
          "Loading recent water levels..."
        ) : (
          <WaterLevelInfo data={data[0]} />
        )
      } */}
    </div>
  );
}

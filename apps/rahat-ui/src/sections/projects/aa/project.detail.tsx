'use client';

import {
  useAAStations,
  useDhmWaterLevels,
  useProjectStore,
} from '@rahat-ui/query';
import ProjectInfo from './project.info';
import { Project } from '@rahataid/sdk/project/project.types';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import WaterLevelInfo from './waterlevel/waterlevel.info';

export default function ProjectDetails() {
  const project = useProjectStore((state) => state.singleProject) as Project;
  const { id } = useParams();
  const projectID = id as UUID;
  useAAStations(projectID);
  const { isLoading: isLoadingWaterLevels, data } =
    useDhmWaterLevels(projectID);

  console.log('water levels data', data);

  return (
    <div className="p-4 bg-slate-100">
      <ProjectInfo project={project} />
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

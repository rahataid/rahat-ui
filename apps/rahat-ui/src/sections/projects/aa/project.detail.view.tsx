import { useParams } from 'next/navigation';
import {
  useAAStations,
  usePhasesStats,
  useProjectStore,
  useStatsStore,
} from '@rahat-ui/query';
import { Project } from '@rahataid/sdk/project/project.types';
import { StyledMapContainer, THEMES } from '@rahat-ui/shadcn/maps';
import { mapboxBasicConfig } from 'apps/rahat-ui/src/constants/config';
import Map from './data-sources/DHM/map';
import ProjectInfo from './project.info';
import { UUID } from 'crypto';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import ProjectStatistics from './project.statistics';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';

export default function ProjectDetails() {
  const project = useProjectStore((state) => state.singleProject) as Project;
  const { id } = useParams();
  const projectID = id as UUID;
  useAAStations(projectID);
  usePhasesStats(projectID);
  const { phasesStats } = useStatsStore();

  return (
    <ScrollArea className="h-[calc(100vh-65px)] bg-secondary">
      <div className="p-4 grid gap-4">
        <ProjectInfo project={project} />
        <div className="h-96 overflow-hidden rounded">
          <StyledMapContainer>
            <Map
              coordinates={[82.3886, 29.3863]}
              {...mapboxBasicConfig}
              mapStyle={THEMES.outdoors}
            />
          </StyledMapContainer>
        </div>
        <ProjectStatistics phasesStats={phasesStats?.phaseActivities} />
      </div>
    </ScrollArea>
  );
}

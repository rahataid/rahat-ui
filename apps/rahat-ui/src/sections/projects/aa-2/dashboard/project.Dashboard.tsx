import {
  useAAStations,
  useAllStats,
  useOfframp,
  useProjectInfo,
  useProjectStore,
} from '@rahat-ui/query';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import Loader from 'apps/community-tool-ui/src/components/Loader';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { Project } from '@rahataid/sdk/project/project.types';
import ProjectInfoCard from './project.info.card';
import ChartsContainer from './charts.container';
import SimpleDataCardsContainer from './simple.data.cards.container';
import DashboardSkeleton from './dashboard.skeleton';

export default function ProjectDashboard() {
  const project = useProjectStore((state) => state.singleProject) as Project;
  console.log(project);
  const { id } = useParams();
  const projectId = id as UUID;
  useAAStations(projectId);
  const { data: allStats, isLoading } = useAllStats(projectId);

  useProjectInfo(projectId);
  return (
    <div className="h-[calc(100vh-65px)] pl-2 pt-2 pr-0">
      <ScrollArea className="mt-2 h-[calc(100vh-100px)] pr-2">
        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <div
              className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 p-2`}
            >
              <SimpleDataCardsContainer allStats={allStats} />
              <ProjectInfoCard project={project} />
            </div>
            <ChartsContainer
              allStats={allStats?.filter(
                (data: any) => data.group === 'beneficiary',
              )}
            />
          </>
        )}
      </ScrollArea>
    </div>
  );
}

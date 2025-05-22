import { useOfframp, useProjectInfo } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';

export default function ProjectDashboard() {
  // const project = useProjectStore((state) => state.singleProject) as Project;
  const { id } = useParams();
  const projectId = id as UUID;
  // useAAStations(projectId);
  // usePhasesStats(projectId);
  // const { phasesStats } = useStatsStore();
  // const { data: allStats, isLoading } = useAllStats(projectId);

  // const { data: commsStats, isLoading: isLoadingCommsStats } =
  //   useCommsStats(projectId);

  // const fundsModal = useBoolean();
  // const onDelete = () => {};
  useProjectInfo(projectId);
  useOfframp(projectId);
  return <div>DASHBOARD</div>;
}

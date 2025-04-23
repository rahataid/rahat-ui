import { useParams } from 'next/navigation';
import {
  useAAStations,
  useAllStats,
  useCommsStats,
  usePhasesStats,
  useProjectStore,
  useStatsStore,
} from '@rahat-ui/query';
import { Project } from '@rahataid/sdk/project/project.types';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { CloudDownload } from 'lucide-react';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import AddFundsModal from '../addFundsModal';
import EditButton from '../../../../components/edit.btn';
import DeleteButton from '../../../../components/delete.btn';
import ProjectInfoCard from './project.info.card';
import { CarouselDemo } from '../../components/carousel.demo';
import SimplePhaseCardContainer from './simple.phase.cards.container';
import { UUID } from 'crypto';
import SimpleDataCardsContainer from './simple.data.cards.container';
import ChartsContainer from './charts.container';
import Loader from 'apps/rahat-ui/src/components/table.loader';

export default function ProjectDetails() {
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

  return (
    // <div className="h-[calc(100vh-65px)] pl-2 pt-2 pr-0 pb-4 bg-secondary">
    //   <AddFundsModal fundsModal={fundsModal} />
    //   <div className="flex gap-4 items-center justify-end p-2 pb-0 pr-4">
    //     <EditButton path="/" />
    //     <DeleteButton name="project" handleContinueClick={onDelete} />
    //     <Button type="button" variant="outline" className="shadow-md" disabled>
    //       <CloudDownload size={18} className="mr-1" />
    //       Download Report
    //     </Button>
    //     <Button onClick={fundsModal.onTrue} className="shadow-md">
    //       Add Budget
    //     </Button>
    //   </div>
    //   <ScrollArea className="mt-2 h-[calc(100vh-142px)] pr-2">
    //     {isLoading || isLoadingCommsStats ? (
    //       <Loader />
    //     ) : (
    //       <>
    //         <div className="grid grid-cols-3 gap-4 p-2">
    //           <ProjectInfoCard project={project} />
    //           <SimplePhaseCardContainer
    //             phasesStats={phasesStats?.phaseActivities?.data}
    //           />
    //           <CarouselDemo />
    //         </div>
    //         <SimpleDataCardsContainer
    //           allStats={allStats}
    //           projectId={projectId}
    //           commsStats={commsStats}
    //         />
    //         <ChartsContainer
    //           allStats={allStats?.filter(
    //             (data: any) => data.group === 'beneficiary',
    //           )}
    //         />
    //       </>
    //     )}
    //   </ScrollArea>
    // </div>
    <div>DASHBOARD</div>
  );
}

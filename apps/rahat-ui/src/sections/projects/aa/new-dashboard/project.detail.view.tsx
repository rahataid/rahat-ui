import { useParams } from 'next/navigation';
import {
  useAAStations,
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
import EditButton from '../../components/edit.btn';
import DeleteButton from '../../components/delete.btn';
import ProjectInfoCard from './project.info.card';
import { CarouselDemo } from '../../components/carousel.demo';
import SimplePhaseCardContainer from './simple.phase.cards.container';
import { UUID } from 'crypto';
import SimpleDataCardsContainer from './simple.data.cards.container';
import ChartsContainer from './charts.container';

export default function ProjectDetails() {
  const project = useProjectStore((state) => state.singleProject) as Project;
  const { id } = useParams();
  const projectID = id as UUID;
  useAAStations(projectID);
  usePhasesStats(projectID);
  const { phasesStats } = useStatsStore();

  const fundsModal = useBoolean();
  const onDelete = () => {};

  return (
    <div className="h-[calc(100vh-65px)] p-4 pr-0 bg-secondary">
      <AddFundsModal fundsModal={fundsModal} />
      <div className="flex gap-4 items-center justify-end pr-4">
        <EditButton path="/" />
        <DeleteButton name="project" handleContinueClick={onDelete} />
        <Button type="button" variant="outline">
          <CloudDownload size={18} className="mr-1" />
          Download receipt
        </Button>
        <Button onClick={fundsModal.onTrue}>Add Budget</Button>
      </div>
      <ScrollArea className="mt-4 h-[calc(100vh-150px)] pr-4">
        <div className="grid gap-4">
          <div className="grid grid-cols-3 gap-4">
            <ProjectInfoCard />
            <SimplePhaseCardContainer />
            <CarouselDemo />
          </div>
          <SimpleDataCardsContainer />
          <ChartsContainer />
        </div>
      </ScrollArea>
    </div>
  );
}
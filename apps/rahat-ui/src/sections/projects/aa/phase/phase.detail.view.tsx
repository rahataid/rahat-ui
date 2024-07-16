import { useParams } from 'next/navigation';
import { useRevertPhase, useSinglePhase } from '@rahat-ui/query';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import TriggerStatementsList from '../trigger-statements/trigger.statements.list';
import AddButton from '../../components/add.btn';
import SearchInput from '../../components/search.input';
import ActivitiesListCard from '../../components/activities.list.card';
import { UUID } from 'crypto';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import PhaseTriggerStatementsList from './phase-triggers-table/trigger.statements.list';

export default function PhaseDetailView() {
  const params = useParams();
  const projectId = params.id as UUID;
  const phaseId = params.phaseId as UUID;
  const { data: phaseDetail, isLoading } = useSinglePhase(projectId, phaseId);
  const revertPhase = useRevertPhase();

  const handleRevert = () => {
    revertPhase.mutateAsync({
      projectUUID: projectId,
      payload: {
        phaseId,
      },
    });
  };

  const handleSearch = () => {};
  return (
    <div className="p-2 h-[calc(100vh-65px)] bg-secondary">
      <div className="mb-4">
        <h1 className="font-semibold text-lg mb-2">{phaseDetail?.name}</h1>
        <div className="flex gap-2">
          <div className="grid gap-2 px-4 py-2 bg-card rounded w-1/4">
            <h1 className="text-muted-foreground">Mandatory Triggers</h1>
            <p>
              Total:{' '}
              {
                phaseDetail?.triggerRequirements?.mandatoryTriggers
                  ?.totalTriggers
              }
            </p>
            <p>
              Required:{' '}
              {
                phaseDetail?.triggerRequirements?.mandatoryTriggers
                  ?.requiredTriggers
              }
            </p>
            <p>
              Received:{' '}
              {
                phaseDetail?.triggerRequirements?.mandatoryTriggers
                  ?.receivedTriggers
              }
            </p>
          </div>
          <div className="grid gap-2 px-4 py-2 bg-card rounded w-1/4">
            <h1 className="text-muted-foreground">Optional Triggers</h1>
            <p>
              Total:{' '}
              {
                phaseDetail?.triggerRequirements?.optionalTriggers
                  ?.totalTriggers
              }
            </p>
            <p>
              Required:{' '}
              {
                phaseDetail?.triggerRequirements?.optionalTriggers
                  ?.requiredTriggers
              }
            </p>
            <p>
              Received:{' '}
              {
                phaseDetail?.triggerRequirements?.optionalTriggers
                  ?.receivedTriggers
              }
            </p>
          </div>
        </div>
      </div>
      <Tabs defaultValue="triggers">
        <TabsList className="bg-secondary gap-4">
          <TabsTrigger
            value="triggers"
            className="w-52 bg-card border data-[state=active]:border-primary"
          >
            Triggers List
          </TabsTrigger>
          <TabsTrigger
            value="activities"
            className="w-52 bg-card border data-[state=active]:border-primary"
          >
            Activities List
          </TabsTrigger>
        </TabsList>
        <TabsContent value="triggers">
          <div className="bg-card p-4 rounded">
            <div className="flex justify-between items-center mb-2">
              <h1 className="font-semibold text-lg">Triggers List</h1>
              <div className="flex gap-2 items-center">
                {/* Search */}
                {/* <SearchInput
                  onSearch={handleSearch}
                  isDisabled={true}
                  name="Trigger Statement"
                /> */}
                {/* Add Trigger Statements Btn */}
                <AddButton
                  path={`/projects/aa/${projectId}/trigger-statements/add`}
                  name="Trigger Statement"
                />
                {phaseDetail?.canRevert && (
                  <Button
                    onClick={handleRevert}
                    disabled={!phaseDetail?.isActive}
                  >
                    Revert Phase
                  </Button>
                )}
              </div>
            </div>
            <PhaseTriggerStatementsList phaseId={phaseId} />
            {/* <TriggerStatementsList
              tableScrollAreaHeight="h-[calc(100vh-456px)]"
              isLoading={isLoading}
              tableData={phaseDetail?.triggers}
            /> */}
          </div>
        </TabsContent>
        <TabsContent value="activities">
          <ActivitiesListCard
            gridClass="grid-cols-2"
            projectId={projectId}
            data={phaseDetail?.activities}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useParams } from 'next/navigation';
import { useRevertPhase, useSinglePhase, useSingleStat } from '@rahat-ui/query';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import AddButton from '../../components/add.btn';
import ActivitiesListCard from '../../components/activities.list.card';
import { UUID } from 'crypto';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import PhaseTriggerStatementsList from './phase-triggers-table/trigger.statements.list';
import DownloadReportBtn from 'apps/rahat-ui/src/components/download.report.btn';
import { generateExcel } from '../generate.excel';
import { toast } from 'react-toastify';

export default function PhaseDetailView() {
  const params = useParams();
  const projectId = params.id as UUID;
  const phaseId = params.phaseId as UUID;
  const { data: phaseDetail, isLoading } = useSinglePhase(projectId, phaseId);
  const revertPhase = useRevertPhase();
  const { data: revertedPhases } = useSingleStat(
    projectId,
    'READINESS_PHASE_REVERTED',
  );

  const handleRevert = () => {
    revertPhase.mutateAsync({
      projectUUID: projectId,
      payload: {
        phaseId,
      },
    });
  };

  const handleDownloadReport = () => {
    if (!revertedPhases) return toast.error('Phase is not reverted yet.');
    const mappedData = revertedPhases?.revertHistory?.map(
      (item: Record<string, any>) => {
        return {
          Phase: item.phase,
          'Reverted At': item.revertedAt,
        };
      },
    );

    generateExcel(mappedData, 'Reverted_Phase_Report', 2);
  };

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
                {
                  phaseDetail?.name === 'READINESS' && (
                    <DownloadReportBtn handleDownload={handleDownloadReport} />
                  ) //Download report btn
                }
              </div>
            </div>
            <PhaseTriggerStatementsList phaseId={phaseId} />
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

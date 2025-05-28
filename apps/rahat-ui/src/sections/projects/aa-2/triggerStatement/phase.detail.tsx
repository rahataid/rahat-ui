import {
  Back,
  CustomAlertDialog,
  Heading,
  IconLabelBtn,
  TableLoader,
} from 'apps/rahat-ui/src/common';
import { Plus, Undo2 } from 'lucide-react';
import { TriggersListTabs, TriggersPhaseCard } from './components';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import { useRevertPhase, useSinglePhase } from '@rahat-ui/query';

export default function PhaseDetail() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;
  const phaseId = params.phaseId as UUID;

  const { data: phase, isLoading } = useSinglePhase(projectId, phaseId);

  const revertPhase = useRevertPhase();

  const handleAddTriggerClick = () => {
    router.push(`/projects/aa/${projectId}/trigger-statements/add`);
  };

  const handleRevertPhase = async () => {
    await revertPhase.mutateAsync({
      projectUUID: projectId,
      payload: { phaseUuid: phaseId },
    });
  };
  return isLoading ? (
    <TableLoader />
  ) : (
    <div className="p-4">
      <Back />
      <div className="flex justify-between items-center">
        <Heading
          title={phase?.name || 'N/A'}
          description={`Detailed view of the ${phase?.name?.toLowerCase()} phase`}
        />
        <div className="flex space-x-2">
          <IconLabelBtn
            variant="outline"
            className="text-primary border-primary"
            Icon={Plus}
            name="Add Trigger"
            handleClick={handleAddTriggerClick}
          />
          <CustomAlertDialog
            dialogTrigger={
              <IconLabelBtn
                disabled={
                  !phase?.isActive || !phase?.canRevert || revertPhase.isPending
                }
                Icon={Undo2}
                name="Revert"
              />
            }
            title="Revert Phase"
            description="Are you sure you want to revert this phase?"
            handleContinueClick={handleRevertPhase}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <TriggersPhaseCard
          title="Phase Overview"
          subtitle={`Overview of ${phase?.name?.toLowerCase()} phase`}
          chartLabels={['Mandatory', 'Optional']}
          chartSeries={[
            phase?.totalMandatoryTriggers,
            phase?.totalOptionalTriggers,
          ]}
          mandatoryTriggers={phase?.totalMandatoryTriggers}
          optionalTriggers={phase?.totalOptionalTriggers}
          triggeredMandatoryTriggers={phase?.totalMandatoryTriggersTriggered}
          triggeredOptionalTriggers={phase?.totalOptionalTriggersTriggered}
          hideAddTrigger={true}
          hideViewDetails={true}
        />
        <div className="p-4 border rounded-sm shadow col-span-2">
          <Heading
            title="Triggers"
            titleStyle="text-xl/6"
            description={`List of all triggers in the ${phase?.name?.toLowerCase()} phase`}
          />
          <TriggersListTabs projectId={projectId} phaseId={phaseId} />
        </div>
      </div>
    </div>
  );
}

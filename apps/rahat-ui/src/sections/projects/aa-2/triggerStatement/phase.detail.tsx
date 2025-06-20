import {
  Back,
  CustomAlertDialog,
  Heading,
  IconLabelBtn,
  TableLoader,
} from 'apps/rahat-ui/src/common';
import { AlertTriangle, Plus, Settings, Undo2 } from 'lucide-react';
import { TriggersListTabs, TriggersPhaseCard } from './components';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import { useRevertPhase, useSinglePhase } from '@rahat-ui/query';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@rahat-ui/shadcn/src/components/ui/alert';
import { format } from 'date-fns';

export default function PhaseDetail() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;
  const phaseId = params.phaseId as UUID;

  const { data: phase, isLoading } = useSinglePhase(projectId, phaseId);

  const date = phase?.activatedAt
    ? format(new Date(phase?.activatedAt), 'MMMM d, yyyy')
    : '';

  const revertPhase = useRevertPhase();

  const handleAddTriggerClick = () => {
    router.push(`/projects/aa/${projectId}/trigger-statements/add`);
  };

  const isDisabled =
    !phase?.isActive || !phase?.canRevert || revertPhase.isPending;

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
            Icon={Settings}
            name="Manage Threshold"
            handleClick={() => {
              router.push(
                `/projects/aa/${projectId}/trigger-statements/phase/${phaseId}/config-threshold`,
              );
            }}
          />

          <IconLabelBtn
            variant="outline"
            className="text-primary border-primary"
            Icon={Plus}
            name="Add Trigger"
            handleClick={handleAddTriggerClick}
          />

          {isDisabled ? (
            <IconLabelBtn Icon={Undo2} name="Revert" disabled />
          ) : (
            <CustomAlertDialog
              dialogTrigger={<IconLabelBtn Icon={Undo2} name="Revert" />}
              title="Revert Phase"
              description="Are you sure you want to revert this phase?"
              handleContinueClick={handleRevertPhase}
            />
          )}
        </div>
      </div>
      {phase?.isActive && (
        <div className="mb-4">
          <Alert
            variant="destructive"
            className="border flex items-center gap-2 border-[#E7564B] rounded-sm bg-red-50 text-[#D92626] px-3 py-2"
          >
            <div className="bg-red-600 text-white p-2 rounded-full">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <AlertTitle className="text-sm mb-0">
                This phase has been triggered
              </AlertTitle>
              <AlertDescription className="text-xs text-gray-700">
                <p>{date}</p>
              </AlertDescription>
            </div>
          </Alert>
        </div>
      )}

      <div className="flex gap-4">
        <div className="flex-shrink-0 w-1/3">
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
            isActive={phase?.isActive}
          />
        </div>

        <div className="p-4 border rounded-sm shadow flex-grow">
          <Heading
            title="Triggers"
            titleStyle="text-xl/6"
            description={`List of all triggers in the ${phase?.name?.toLowerCase()} phase`}
          />
          <TriggersListTabs
            projectId={projectId}
            phaseId={phaseId}
            triggers={phase?.triggers}
            riverBasin={phase?.source.riverBasin}
          />
        </div>
      </div>
    </div>
  );
}

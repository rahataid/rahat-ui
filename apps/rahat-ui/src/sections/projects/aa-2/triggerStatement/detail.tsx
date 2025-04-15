import {
  useActivateTrigger,
  useDeleteTriggerStatement,
  useSingleTriggerStatement,
} from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Back,
  DeleteButton,
  EditButton,
  Heading,
  TableLoader,
} from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';

export default function TriggerStatementDetail() {
  const router = useRouter();
  const { id } = useParams() as { id: UUID };

  const triggerRepeatKey = window.location.href.split('/').slice(-1)[0];

  const { data: trigger, isLoading } = useSingleTriggerStatement(
    id,
    triggerRepeatKey,
  );

  const activateTigger = useActivateTrigger();
  const removeTrigger = useDeleteTriggerStatement();

  const handleTrigger = async () => {
    await activateTigger.mutateAsync({
      projectUUID: id,
      activatePayload: { repeatKey: triggerRepeatKey },
    });
    router.push(`/projects/aa/${id}/trigger-statements`);
  };

  const handleDelete = async () => {
    await removeTrigger.mutateAsync({
      projectUUID: id,
      triggerStatementPayload: { repeatKey: triggerRepeatKey },
    });
    router.push(`/projects/aa/${id}/trigger-statements`);
  };
  return isLoading ? (
    <TableLoader />
  ) : (
    <div className="p-4">
      <Back />
      <div className="flex justify-between items-center mb-4">
        <Heading
          title="Trigger Details"
          description="Detailed view of the selected trigger"
        />
        <div className="flex space-x-2">
          <DeleteButton
            className="rounded flex gap-1 items-center text-sm font-medium"
            name="trigger"
            label="Delete"
            handleContinueClick={handleDelete}
          />
          <EditButton
            className="rounded flex gap-1 items-center text-sm font-medium"
            label="Edit"
            onFallback={() =>
              router.push(
                `/projects/aa/${id}/trigger-statements/${triggerRepeatKey}/edit`,
              )
            }
            disabled={trigger?.phase?.isActive}
          />
          <Button
            disabled={trigger?.source !== 'MANUAL' || trigger?.isTriggered}
            onClick={handleTrigger}
          >
            Trigger
          </Button>
        </div>
      </div>
      <div
        className={`grid ${
          trigger?.source !== 'MANUAL' ? 'grid-cols-2' : 'grid-cols-1'
        } gap-4`}
      >
        <div className="p-4 border rounded-sm">
          <Heading
            title={trigger?.title}
            titleStyle="text-lg/7"
            description=""
          />
          <div className="grid grid-cols-4 text-sm/4 text-muted-foreground mt-6">
            <div>
              <p className="mb-1">River Basin</p>
              <p>{trigger?.phase?.source?.riverBasin || 'N/A'}</p>
            </div>
            <div>
              <p className="mb-1">Phase</p>
              <Badge>{trigger?.phase?.name || 'N/A'}</Badge>
            </div>
            <div>
              <p className="mb-1">Trigger Type</p>
              <Badge>
                {trigger?.source === 'MANUAL' ? 'Manual' : 'Automated'}
              </Badge>
            </div>
            <div>
              <p className="mb-1">Type</p>
              <Badge>{trigger?.isMandatory ? 'Mandatory' : 'Optional'}</Badge>
            </div>
            {trigger?.isTriggered && (
              <div>
                <p className="mb-1">Triggered At</p>
                <p>{new Date(trigger?.triggeredAt).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
        {trigger?.source !== 'MANUAL' && (
          <div className="p-4 border rounded-sm">
            <Heading
              title="Forecast Data"
              titleStyle="text-sm/4"
              description={`Source:${
                trigger?.phase?.source?.riverBasin || 'N/A'
              }`}
            />
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 text-center border rounded">
                <p className="font-semibold text-3xl/10 text-primary">
                  {trigger?.triggerStatement?.minLeadTimeDays}
                </p>
                <p className="font-medium text-sm/6">Minimum Lead Time Days</p>
              </div>
              <div className="p-3 text-center border rounded">
                <p className="font-semibold text-3xl/10 text-primary">
                  {trigger?.triggerStatement?.maxLeadTimeDays}
                </p>
                <p className="font-medium text-sm/6">Maximum Lead Time Days</p>
              </div>
              <div className="p-3 text-center border rounded">
                <p className="font-semibold text-3xl/10 text-primary">
                  {trigger?.triggerStatement?.probability}
                </p>
                <p className="font-medium text-sm/6">Forecast Probability</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

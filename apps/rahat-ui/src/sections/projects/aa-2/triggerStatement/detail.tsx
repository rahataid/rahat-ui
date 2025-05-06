import {
  useDeleteTriggerStatement,
  useSingleTriggerStatement,
} from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Back,
  DeleteButton,
  EditButton,
  Heading,
  TableLoader,
} from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import {
  ActivateTriggerDialog,
  DocumentsSection,
  ForecastDataSection,
} from './components';

export default function TriggerStatementDetail() {
  const router = useRouter();
  const { id } = useParams() as { id: UUID };

  const triggerRepeatKey = window.location.href.split('/').slice(-1)[0];

  const { data: trigger, isLoading } = useSingleTriggerStatement(
    id,
    triggerRepeatKey,
  );

  const phase = trigger?.phase?.name;
  const source = trigger?.source;

  const removeTrigger = useDeleteTriggerStatement();

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
            disabled={trigger?.isTriggered}
          />
          <EditButton
            className="rounded flex gap-1 items-center text-sm font-medium"
            label="Edit"
            onFallback={() =>
              router.push(
                `/projects/aa/${id}/trigger-statements/${triggerRepeatKey}/edit`,
              )
            }
            disabled={trigger?.phase?.isActive || trigger?.isTriggered}
          />
          {source === 'MANUAL' && !trigger?.isTriggered && (
            <ActivateTriggerDialog
              projectId={id}
              repeatKey={triggerRepeatKey}
            />
          )}
        </div>
      </div>
      <div
        className={`grid ${
          source !== 'MANUAL' ? 'grid-cols-2' : 'grid-cols-1'
        } gap-4`}
      >
        <div className="p-4 border rounded-sm shadow">
          <Heading
            title={trigger?.title}
            titleStyle="text-lg/7"
            description=""
          />
          <div
            className={`grid ${
              trigger?.isTriggered ? 'grid-cols-5' : 'grid-cols-4'
            } text-sm/4 text-muted-foreground mt-6`}
          >
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
              <Badge>{source === 'MANUAL' ? 'Manual' : 'Automated'}</Badge>
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
        {source !== 'MANUAL' && (
          <ForecastDataSection
            phase={phase}
            source={source}
            triggerStatement={trigger?.triggerStatement}
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {source === 'MANUAL' && trigger?.triggerDocuments && (
          <DocumentsSection
            triggerDocuments={trigger?.triggerDocuments}
            date={trigger?.updatedAt}
          />
        )}

        {trigger?.notes && (
          <div className="p-4 border rounded-sm shadow">
            <Heading
              title="Trigger Notes"
              titleStyle="text-lg/7"
              description=""
            />
            <div className="bg-gray-100 rounded-sm p-4">
              <p className="text-sm/4 mb-1">{trigger?.notes}</p>
              <p className="text-gray-500 text-sm/4">
                {new Date(trigger?.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

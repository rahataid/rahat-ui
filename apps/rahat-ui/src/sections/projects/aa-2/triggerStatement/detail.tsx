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
  Heading,
  IconLabelBtn,
} from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { Pencil, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function TriggerStatementDetail() {
  const router = useRouter();
  const { id } = useParams() as { id: UUID };

  const triggerRepeatKey = window.location.href.split('/').slice(-1)[0];

  const trigger = useSingleTriggerStatement(id, triggerRepeatKey);

  const activateTigger = useActivateTrigger();
  const removeTrigger = useDeleteTriggerStatement();

  const handleTrigger = async () => {
    await activateTigger.mutateAsync({
      projectUUID: id,
      activatePayload: { repeatKey: triggerRepeatKey },
    });
  };

  const handleDelete = async () => {
    await removeTrigger.mutateAsync({
      projectUUID: id,
      triggerStatementPayload: { repeatKey: triggerRepeatKey },
    });
    router.push(`/projects/aa/${id}/trigger-statements`);
  };
  return (
    <div className="p-4">
      <Back />
      <div className="flex justify-between items-center mb-4">
        <Heading
          title="Trigger Details"
          description="Detailed view of the selected trigger"
        />
        <div className="flex space-x-2">
          {/* <IconLabelBtn
            variant="outline"
            className="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-600"
            Icon={Trash2}
            name="Delete"
            handleClick={handleDelete}
          /> */}
          <DeleteButton
            className="rounded flex gap-1 items-center"
            name="trigger"
            label="Delete"
            handleContinueClick={handleDelete}
          />
          {/* <IconLabelBtn
            variant="outline"
            className="text-gray-500"
            Icon={Pencil}
            name="Edit"
            handleClick={() => {}}
          /> */}
          <Button
            disabled={trigger?.triggerStatement?.type === 'automated'}
            onClick={handleTrigger}
          >
            Trigger
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
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
              <Badge>{trigger?.triggerStatement?.type || 'N/A'}</Badge>
            </div>
            <div>
              <p className="mb-1">Type</p>
              <Badge>{trigger?.isMandatory ? 'Mandatory' : 'Optional'}</Badge>
            </div>
          </div>
        </div>
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
      </div>
    </div>
  );
}

import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { UUID } from 'crypto';

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

import {
  ActivateTriggerDialog,
  DocumentsSection,
  ForecastDataSection,
} from './components';

export default function TriggerStatementDetail() {
  const router = useRouter();
  const params = useParams();

  const id = params?.id as UUID;
  const triggerID = Number(params?.triggerID);
  const searchparams = useSearchParams();
  const type = searchparams?.get('type');
  const version = searchparams.get('version') === 'true' ? true : false;
  const triggerRepeatKey = version
    ? triggerID
    : window.location.href.split('/').slice(-1)[0];

  const { data: trigger, isLoading } = useSingleTriggerStatement(
    id,
    triggerRepeatKey,
    version,
  );

  const phase = trigger?.phase?.name;
  const source = trigger?.source;

  const removeTrigger = useDeleteTriggerStatement();

  const versionType = type as string | undefined;

  const handleDelete = async () => {
    await removeTrigger.mutateAsync({
      projectUUID: id,
      triggerStatementPayload: { repeatKey: triggerRepeatKey as string },
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
          status={versionType && `V${versionType}`}
        />
        <div className="flex space-x-2">
          <DeleteButton
            className={`rounded flex gap-1 items-center text-sm font-medium ${
              version && 'hidden'
            }`}
            name="trigger"
            label="Delete"
            handleContinueClick={handleDelete}
            disabled={trigger?.isTriggered}
          />
          <EditButton
            className={`rounded flex gap-1 items-center text-sm font-medium ${
              version && 'hidden'
            }`}
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
              repeatKey={triggerRepeatKey as string}
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
              trigger?.isTriggered ? 'grid-cols-6' : 'grid-cols-5'
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

            <div className="flex-1 min-w-0">
              <p className="mb-1">TxHash</p>
              {trigger?.transactionHash ? (
                <Link
                  href={`https://stellar.expert/explorer/testnet/tx/${trigger.transactionHash}`}
                  target="_blank"
                  className="block overflow-hidden text-ellipsis whitespace-nowrap text-blue-500 hover:underline"
                >
                  {trigger.transactionHash}
                </Link>
              ) : (
                <p className="text-red-500">N/A</p>
              )}
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

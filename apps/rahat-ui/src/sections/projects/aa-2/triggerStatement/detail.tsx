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
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { AARoles, RoleAuth } from '@rahat-ui/auth';

export default function TriggerStatementDetail() {
  const router = useRouter();
  const params = useParams();

  const id = params?.id as UUID;
  const triggerID = Number(params?.triggerID);
  const searchparams = useSearchParams();
  const type = searchparams?.get('type');
  const version = searchparams.get('version') === 'true' ? true : false;
  const triggerIdKey = version
    ? triggerID
    : window.location.href.split('/').slice(-1)[0];

  const { data: trigger, isLoading } = useSingleTriggerStatement(
    id,
    triggerIdKey,
    version,
  );

  const phase = trigger?.phase?.name;
  const source = trigger?.source;

  const removeTrigger = useDeleteTriggerStatement();

  const versionType = type as string | undefined;

  const handleDelete = async () => {
    await removeTrigger.mutateAsync({
      projectUUID: id,
      triggerStatementPayload: { uuid: triggerIdKey as string },
    });
    router.push(
      `/projects/aa/${id}/trigger-statements/phase/${trigger?.phaseId}`,
    );
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
          status={
            versionType
              ? `V${versionType}`
              : trigger?.isTriggered && 'Triggered'
          }
          badgeClassName={`${
            versionType
              ? ''
              : trigger?.isTriggered
              ? 'text-red-500 bg-red-100'
              : 'text-green-500 bg-green-100'
          } text-xs`}
        />
        <div className="flex space-x-2">
          <RoleAuth roles={[AARoles.ADMIN]} hasContent={false}>
            <DeleteButton
              className={`rounded flex gap-1 items-center text-sm font-medium ${
                version && 'hidden'
              }`}
              name="trigger"
              label="Delete"
              handleContinueClick={handleDelete}
              disabled={trigger?.isTriggered || trigger?.phase?.isActive}
            />
          </RoleAuth>
          <RoleAuth roles={[AARoles.ADMIN]} hasContent={false}>
            <EditButton
              className={`rounded flex gap-1 items-center text-sm font-medium ${
                version && 'hidden'
              }`}
              label="Edit"
              onFallback={() =>
                router.push(
                  `/projects/aa/${id}/trigger-statements/${triggerIdKey}/edit`,
                )
              }
              disabled={trigger?.phase?.isActive || trigger?.isTriggered}
            />
          </RoleAuth>
          <RoleAuth roles={[AARoles.ADMIN, AARoles.MANAGER]} hasContent={false}>
            {source === 'MANUAL' &&
              !trigger?.phase?.isActive &&
              !trigger?.isTriggered && (
                <ActivateTriggerDialog
                  projectId={id}
                  triggerId={triggerIdKey as string}
                  version={version}
                  notes={trigger?.notes}
                />
              )}
          </RoleAuth>
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
            description={trigger?.description}
          />
          <div
            className={`grid ${
              trigger?.isTriggered ? 'grid-cols-8' : 'grid-cols-6'
            } text-sm/4 text-muted-foreground mt-6`}
          >
            <div>
              <p className="mb-1">River Basin</p>
              <p>{trigger?.phase?.source?.riverBasin || 'N/A'}</p>
            </div>
            <div>
              <p className="mb-1">Phase</p>
              <Badge
                className={`${
                  trigger?.phase?.name === 'READINESS'
                    ? 'text-yellow-500 bg-yellow-100'
                    : 'text-red-500 bg-red-100'
                } text-xs`}
              >
                {trigger?.phase?.name || 'N/A'}
              </Badge>
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
            {trigger?.createdBy && (
              <div>
                <p className="mb-1">Created By</p>
                <p>{trigger?.createdBy}</p>
              </div>
            )}
            {trigger?.isTriggered && (
              <div>
                <p className="mb-1">Triggered At</p>
                <p>{dateFormat(trigger?.triggeredAt)}</p>
              </div>
            )}
            {trigger?.triggeredBy && (
              <div>
                <p className="mb-1">Triggered By</p>
                <p>{trigger?.triggeredBy}</p>
              </div>
            )}
          </div>
        </div>
        {source !== 'MANUAL' &&
          Object.keys(trigger?.triggerStatement || {})?.length && (
            <ForecastDataSection
              phase={phase}
              source={source}
              triggerStatement={trigger?.triggerStatement}
            />
          )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {source === 'MANUAL' && trigger?.triggerDocuments?.length > 0 && (
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
                {dateFormat(trigger?.updatedAt)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

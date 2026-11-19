'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { UUID } from 'crypto';
import { useDeleteTriggerCallback, useSingleActivity } from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Back, Heading } from 'apps/rahat-ui/src/common';
import { Link2 } from 'lucide-react';
import ConfirmationDialog from 'apps/rahat-ui/src/common/confirmationDialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  LinkedCallbackRow,
  LinkedContextHeader,
  LinkedEmptyState,
  LinkedListSkeleton,
} from './components/linked.callback.parts';

export default function ManageTriggerCallbackView() {
  const t = useTranslations('AA_PROJECT');
  const router = useRouter();
  const { id: projectId } = useParams();
  const searchParams = useSearchParams();
  const activityId = searchParams.get('activityId') || '';

  const { data: activity, isLoading } = useSingleActivity(
    projectId as UUID,
    activityId,
    !!activityId,
  );

  const triggersCallback: any[] = activity?.triggersCallback || [];

  const [pendingDelete, setPendingDelete] = useState<{
    uuid: string;
    triggerTitle: string;
  } | null>(null);

  const deleteTriggerCallback = useDeleteTriggerCallback();

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteTriggerCallback.mutateAsync({
        projectUUID: projectId as UUID,
        triggerCallbackUuid: pendingDelete.uuid,
      });
    } finally {
      setPendingDelete(null);
    }
  };

  const getCommunicationTitle = (communicationId: string) =>
    activity?.activityCommunication?.find(
      (comm: any) => comm.communicationId === communicationId,
    )?.communicationTitle || communicationId;

  const goToLinkTrigger = () =>
    router.push(
      `/projects/aa/${projectId}/trigger-callbacks/add?activityId=${activityId}`,
    );

  return (
    <div className="p-4">
      <Back />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Heading
          title={t('MANAGE_LINKED_TRIGGERS')}
          description={t('VIEW_AND_REMOVE_LINKED_TRIGGERS')}
        />
        <Button
          type="button"
          className="gap-2 flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white"
          onClick={goToLinkTrigger}
        >
          <Link2 className="w-4 h-4" />
          {t('LINK_TRIGGER')}
        </Button>
      </div>

      <div className="mt-4 rounded-sm border bg-white shadow">
        <LinkedContextHeader
          kind="activity"
          title={activity?.title || t('ACTIVITY')}
          meta={[activity?.phase?.name, activity?.category?.name].filter(
            Boolean,
          )}
          countLabel={t('LINKED_TRIGGERS_COUNT', {
            count: triggersCallback.length,
          })}
          isLoading={isLoading}
        />

        {isLoading ? (
          <LinkedListSkeleton />
        ) : triggersCallback.length === 0 ? (
          <LinkedEmptyState
            kind="trigger"
            message={t('NO_TRIGGER_LINKED_TO_ACTIVITY')}
            hint={t('NO_TRIGGER_LINKED_HINT')}
            actionLabel={t('LINK_TRIGGER')}
            onAction={goToLinkTrigger}
          />
        ) : (
          <ul className="flex flex-col divide-y">
            {triggersCallback.map((cb: any) => {
              const trigger = cb.trigger;
              const communicationIds: string[] =
                cb?.config?.communicationIds || [];

              return (
                <LinkedCallbackRow
                  key={cb.uuid}
                  kind="trigger"
                  title={trigger?.title}
                  tooltip={`${t('TRIGGER')}: ${trigger?.title}`}
                  href={
                    trigger?.uuid
                      ? `/projects/aa/${projectId}/trigger-statements/${trigger.uuid}`
                      : undefined
                  }
                  status={
                    trigger?.isTriggered && (
                      <Badge className="bg-green-100 text-green-700 text-[11px] font-normal hover:bg-green-100 flex-shrink-0">
                        {t('TRIGGERED')}
                      </Badge>
                    )
                  }
                  meta={[trigger?.phase?.name, trigger?.source].filter(
                    Boolean,
                  )}
                  communicationTitles={communicationIds.map(
                    getCommunicationTitle,
                  )}
                  removeLabel={t('REMOVE_LINKED_TRIGGER')}
                  isRemoving={
                    deleteTriggerCallback.isPending &&
                    pendingDelete?.uuid === cb.uuid
                  }
                  onRemove={() =>
                    setPendingDelete({
                      uuid: cb.uuid,
                      triggerTitle: trigger?.title,
                    })
                  }
                />
              );
            })}
          </ul>
        )}
      </div>

      <ConfirmationDialog
        isConfirmationDialogOpen={!!pendingDelete}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
        dialogTitle={t('REMOVE_LINKED_TRIGGER')}
        isDestructive
      >
        {t('REMOVE_LINKED_TRIGGER_CONFIRM', {
          title: pendingDelete?.triggerTitle || '',
        })}
      </ConfirmationDialog>
    </div>
  );
}

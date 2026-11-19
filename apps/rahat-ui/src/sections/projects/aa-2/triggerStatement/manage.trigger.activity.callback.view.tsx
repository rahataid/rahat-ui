'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { UUID } from 'crypto';
import {
  useActivities,
  useDeleteTriggerCallback,
  useSingleTriggerStatement,
} from '@rahat-ui/query';
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

export default function ManageTriggerActivityCallbackView() {
  const t = useTranslations('AA_PROJECT');
  const router = useRouter();
  const { id: projectId } = useParams();
  const searchParams = useSearchParams();
  const triggerId = searchParams.get('triggerId') || '';

  const { data: trigger, isLoading } = useSingleTriggerStatement(
    projectId as UUID,
    triggerId,
    false,
    !!triggerId,
  );
  const { activitiesData } = useActivities(projectId as UUID, {
    perPage: 9999,
  });

  const callbacks: any[] = trigger?.callbacks || [];

  const getActivity = (xref: string) =>
    activitiesData?.find((a: any) => a.id === xref);

  const getCommunicationTitle = (xref: string, communicationId: string) =>
    getActivity(xref)?.activityCommunication?.find(
      (comm: any) => comm.communicationId === communicationId,
    )?.communicationTitle || communicationId;

  const [pendingDelete, setPendingDelete] = useState<{
    uuid: string;
    activityTitle: string;
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

  const goToLinkActivity = () =>
    router.push(
      `/projects/aa/${projectId}/trigger-callbacks/add?triggerId=${triggerId}`,
    );

  return (
    <div className="p-4">
      <Back />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Heading
          title={t('MANAGE_LINKED_ACTIVITIES')}
          description={t('VIEW_AND_REMOVE_LINKED_ACTIVITIES')}
        />
        <Button
          type="button"
          className="gap-2 flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white"
          onClick={goToLinkActivity}
        >
          <Link2 className="w-4 h-4" />
          {t('LINK_ACTIVITY')}
        </Button>
      </div>

      <div className="mt-4 rounded-sm border bg-white shadow">
        <LinkedContextHeader
          kind="trigger"
          title={trigger?.title || t('TRIGGER')}
          meta={[trigger?.phase?.name, trigger?.source].filter(Boolean)}
          countLabel={t('LINKED_ACTIVITIES_COUNT', { count: callbacks.length })}
          isLoading={isLoading}
        />

        {isLoading ? (
          <LinkedListSkeleton />
        ) : callbacks.length === 0 ? (
          <LinkedEmptyState
            kind="activity"
            message={t('NO_ACTIVITY_LINKED_TO_TRIGGER')}
            hint={t('NO_ACTIVITY_LINKED_HINT')}
            actionLabel={t('LINK_ACTIVITY')}
            onAction={goToLinkActivity}
          />
        ) : (
          <ul className="flex flex-col divide-y">
            {callbacks.map((cb: any) => {
              const activity = getActivity(cb.xref);
              const communicationIds: string[] =
                cb?.config?.communicationIds || [];
              const activityTitle = activity?.title || cb.xref;

              return (
                <LinkedCallbackRow
                  key={cb.uuid}
                  kind="activity"
                  title={activityTitle}
                  tooltip={`${t('ACTIVITY')}: ${activityTitle}`}
                  href={`/projects/aa/${projectId}/activities/${
                    cb.xref
                  }?returnTo=${encodeURIComponent(
                    `/projects/aa/${projectId}/trigger-callbacks/manage-activities?triggerId=${triggerId}`,
                  )}`}
                  meta={[activity?.phase, activity?.category].filter(Boolean)}
                  communicationTitles={communicationIds.map((commId) =>
                    getCommunicationTitle(cb.xref, commId),
                  )}
                  removeLabel={t('REMOVE_LINKED_ACTIVITY')}
                  isRemoving={
                    deleteTriggerCallback.isPending &&
                    pendingDelete?.uuid === cb.uuid
                  }
                  onRemove={() =>
                    setPendingDelete({
                      uuid: cb.uuid,
                      activityTitle,
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
        dialogTitle={t('REMOVE_LINKED_ACTIVITY')}
        isDestructive
      >
        {t('REMOVE_LINKED_ACTIVITY_CONFIRM', {
          title: pendingDelete?.activityTitle || '',
        })}
      </ConfirmationDialog>
    </div>
  );
}

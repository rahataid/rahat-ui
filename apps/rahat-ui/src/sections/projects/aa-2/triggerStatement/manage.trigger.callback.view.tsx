'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { UUID } from 'crypto';
import { useDeleteTriggerCallback, useSingleActivity } from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Back, Heading, NoResult, SpinnerLoader } from 'apps/rahat-ui/src/common';
import { Link2, Trash2, Zap } from 'lucide-react';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';
import ConfirmationDialog from 'apps/rahat-ui/src/common/confirmationDialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

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

  return (
    <div className="p-4">
      <Back />
      <div className="flex items-center justify-between gap-2">
        <Heading
          title={t('MANAGE_LINKED_TRIGGERS')}
          description={t('VIEW_AND_REMOVE_LINKED_TRIGGERS')}
        />
        <Button
          type="button"
          className="gap-2 flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() =>
            router.push(
              `/projects/aa/${projectId}/trigger-callbacks/add?activityId=${activityId}`,
            )
          }
        >
          <Link2 className="w-4 h-4" />
          {t('LINK_TRIGGER')}
        </Button>
      </div>

      <div className="flex items-center gap-2 mt-4 mb-3">
        <Zap className="w-4 h-4 text-green-500 rotate-90" />
        <p className="font-medium text-sm">
          {activity?.title || t('ACTIVITY')}
        </p>
        {triggersCallback.length > 0 && (
          <Badge className="bg-blue-100 text-blue-700">
            {triggersCallback.length}
          </Badge>
        )}
      </div>

      <div className="rounded-xl border bg-white">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <SpinnerLoader />
          </div>
        ) : triggersCallback.length === 0 ? (
          <NoResult message={t('NO_TRIGGER_LINKED_TO_ACTIVITY')} />
        ) : (
          <div className="flex flex-col divide-y">
            {triggersCallback.map((cb: any) => {
              const communicationIds: string[] =
                cb?.config?.communicationIds || [];
              const isActivityWide = communicationIds.length === 0;

              return (
                <div
                  key={cb.uuid}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <TooltipWrapper
                      tip={`${t('TRIGGER')}: ${cb.trigger?.title}`}
                    >
                      <p className="text-sm font-medium truncate">
                        {cb.trigger?.title}
                      </p>
                    </TooltipWrapper>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      {isActivityWide ? (
                        <Badge className="bg-gray-100 text-gray-600 text-xs font-normal">
                          {t('ALL_COMMUNICATIONS')}
                        </Badge>
                      ) : (
                        communicationIds.map((commId) => (
                          <Badge
                            key={commId}
                            className="bg-blue-50 text-blue-700 text-xs font-normal"
                          >
                            {getCommunicationTitle(commId)}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                  <TooltipWrapper tip={t('REMOVE_LINKED_TRIGGER')}>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="text-red-500 border-red-200 hover:bg-red-50 flex-shrink-0"
                      onClick={() =>
                        setPendingDelete({
                          uuid: cb.uuid,
                          triggerTitle: cb.trigger?.title,
                        })
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TooltipWrapper>
                </div>
              );
            })}
          </div>
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

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import { ArchiveRestore, Pencil } from 'lucide-react';
import AutomatedTriggerDetailCards from './automated.trigger.detail.cards';
import AutomatedTriggerDetailCard from './automated.trigger.detail.card';

import {
  useSingleTriggerStatement,
  useDeleteTriggerStatement,
} from '@rahat-ui/query';

import { UUID } from 'crypto';
import Loader from 'apps/rahat-ui/src/components/table.loader';
import ManualTriggerDialog from './manual.trigger.dialog';
import ManualTriggerDetailCard from './manual.trigger.detail.card';
import ManualTriggerDocumentsCard from './manual.trigger.documents.card';
import Back from '../../../components/back';

export default function TriggerStatementsDetailView() {
  const t = useTranslations('GLOBAL');
  const tc = useTranslations('Confirmation & Alert Dialogs');
  const { id: projectID } = useParams();
  const router = useRouter();
  const triggerRepeatKey = window.location.href.split('/').slice(-1)[0];
  const { data: triggerDetail, isLoading } = useSingleTriggerStatement(
    projectID as UUID,
    triggerRepeatKey,
  );

  const deleteTrigger = useDeleteTriggerStatement();

  const removeTrigger = () => {
    deleteTrigger.mutateAsync({
      projectUUID: projectID as UUID,
      triggerStatementPayload: {
        repeatKey: triggerRepeatKey,
      },
    });
  };

  React.useEffect(() => {
    deleteTrigger.isSuccess && router.back();
  }, [deleteTrigger]);

  if (isLoading) return <Loader />;

  return (
    <div className="h-[calc(100vh-65px)] bg-secondary p-4">
      <div className="flex justify-between">
        <div className="flex gap-4 items-center">
          <Back path={`/projects/aa/${projectID}/trigger-statements`} />
          <h1 className="text-xl font-semibold">{triggerDetail?.title}</h1>
        </div>
        <div className="flex gap-4 items-center">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger>
                <AlertDialog>
                  <AlertDialogTrigger className="flex items-center">
                    <div className="rounded-full border border-red-500 text-red-500 bg-card p-2">
                      <ArchiveRestore size={20} strokeWidth={1.5} />
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>
                      {t('ARE_YOU_ABSOLUTELY_SURE')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {tc('THIS_ACTION_CANNOT_BE_UNDONE_THIS', { name: 'trigger statement' })}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('CANCEL')}</AlertDialogCancel>
                    <AlertDialogAction onClick={removeTrigger}>
                      {t('CONTINUE')}
                    </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TooltipTrigger>
              <TooltipContent className="bg-secondary ">
                <p className="text-xs font-medium">{t('DELETE')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {triggerDetail?.dataSource === 'MANUAL' ? (
            <ManualTriggerDialog />
          ) : null}
        </div>
      </div>
      {triggerDetail?.dataSource === 'MANUAL' ? (
        <div className="grid grid-cols-2 gap-4 mt-4 h-[calc(100vh-152px)]">
          <ManualTriggerDetailCard
            status={triggerDetail?.isTriggered}
            triggeredAt={triggerDetail?.triggeredAt}
            triggeredBy={triggerDetail?.triggeredBy}
            notes={triggerDetail?.notes}
            phase={triggerDetail?.phase?.name}
          />
          <ManualTriggerDocumentsCard
            documents={triggerDetail?.triggerDocuments}
          />
        </div>
      ) : (
        <>
          <AutomatedTriggerDetailCards triggerDetail={triggerDetail} />
          <div className="mt-4 h-[calc(100vh-252px)]">
            <AutomatedTriggerDetailCard triggerDetail={triggerDetail} />
          </div>
        </>
      )}
    </div>
  );
}

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ArrowLeft, ArchiveRestore, Pencil } from 'lucide-react';
import TriggerDetailCards from './trigger.detail.cards';
import TriggerDetailCard from './trigger.detail.card';
import TriggerActivityListCard from './trigger.activity.list.card';
import { useSingleTriggerStatement, useDeleteTriggerStatement } from '@rahat-ui/query';
import { UUID } from 'crypto';

export default function TriggerStatementsDetailView() {
  const { id: projectID } = useParams();
  const router = useRouter();
  const triggerRepeatKey = window.location.href.split("/").slice(-1)[0]
  const { data: triggerDetail } = useSingleTriggerStatement(
    projectID as UUID,
    triggerRepeatKey,
  );
  const deleteTrigger = useDeleteTriggerStatement();

  const removeTrigger = () => {
    deleteTrigger.mutateAsync({
      projectUUID: projectID as UUID,
      triggerStatementPayload: {
        repeatKey: triggerRepeatKey
      }
    })
  }

  React.useEffect(() => {
    deleteTrigger.isSuccess && router.back();
  }, [deleteTrigger])

  return (
    <div className="h-[calc(100vh-65px)] bg-secondary p-4">
      <div className="flex justify-between">
        <div className="flex gap-4 items-center">
          <ArrowLeft
            size={25}
            strokeWidth={1.5}
            className="cursor-pointer"
            onClick={() => router.back()}
          />
          <h1 className="text-xl font-semibold">{triggerDetail?.title}</h1>
        </div>
        <div className="flex gap-4 items-center">
          <div className="rounded-full border border-primary text-primary bg-card p-2">
            <Pencil size={20} strokeWidth={1.5} />
          </div>
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
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this trigger statement.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={removeTrigger}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TooltipTrigger>
              <TooltipContent className="bg-secondary ">
                <p className="text-xs font-medium">Delete</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button type="button" className="px-8">
            Trigger
          </Button>
        </div>
      </div>
      <TriggerDetailCards triggerDetail={triggerDetail} />
      <div className="grid grid-cols-2 gap-4 mt-4 h-[calc(100vh-252px)]">
        <TriggerDetailCard triggerDetail={triggerDetail} />
        <TriggerActivityListCard triggerDetail={triggerDetail} />
      </div>
    </div>
  );
}

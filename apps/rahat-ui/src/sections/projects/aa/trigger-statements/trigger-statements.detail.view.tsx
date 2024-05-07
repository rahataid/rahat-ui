import { useParams } from 'next/navigation';
import { useEffect } from 'react';
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
import { Minus, Trash2 } from 'lucide-react';
import { useDeleteTriggerStatement } from '@rahat-ui/query';
import { UUID } from 'crypto';

type IProps = {
  triggerStatement: any;
  closeSecondPanel: VoidFunction;
};

function renderManualTrigger({ title, notes }: {
  title: string
  notes: string
}) {
  return (
    <>
      <div>
        Title: {title}
      </div>
      <div>
        Notes: {notes}
      </div>

    </>
  )
}

function renderOtherTriggers(triggerStatement: any) {
  return (
    <>
      {
        triggerStatement.dataSource === 'DHM' && (
          <>
            <div>Readiness Level: {triggerStatement.triggerStatement.readinessLevel}</div>
            <div>Activation Level: {triggerStatement.triggerStatement.activationLevel}</div>
          </>
        )
      }
    </>
  )

}

export default function TriggerStatementsDetail({
  triggerStatement,
  closeSecondPanel,
}: IProps) {
  const { id: projectID } = useParams();
  const deleteTriggerStatement = useDeleteTriggerStatement();


  const deleteRow = (row: any) => {
    deleteTriggerStatement.mutateAsync({
      projectUUID: projectID as UUID,
      triggerStatementPayload: {
        repeatKey: row.repeatKey,
      },
    });
  };


  useEffect(() => {
    deleteTriggerStatement.isSuccess && closeSecondPanel();
  }, [deleteTriggerStatement]);

  console.log(triggerStatement)

  return (
    <>
      <div className="flex justify-between items-center py-5 px-2 bg-secondary">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger onClick={closeSecondPanel}>
              <Minus size={20} strokeWidth={1.5} />
            </TooltipTrigger>
            <TooltipContent className="bg-secondary ">
              <p className="text-xs font-medium">Close</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex gap-4 items-center">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger>
                <AlertDialog>
                  <AlertDialogTrigger className="flex items-center">
                    <Trash2
                      className="cursor-pointer"
                      color="red"
                      size={20}
                      strokeWidth={1.5}
                    />
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
                        onClick={() => deleteRow(triggerStatement)}
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
        </div>
      </div>
      <div className="flex flex-col gap-2 m-2 p-2 border rounded">
        <h1 className="p-2 font-semibold text-lg bg-secondary">
          Trigger Statement Details
        </h1>

        {
          triggerStatement.dataSource === 'MANUAL' && (
            renderManualTrigger({
              title: triggerStatement.title,
              notes: triggerStatement.notes
            })
          )
        }

        {
          triggerStatement.dataSource !== 'MANUAL' && (
            renderOtherTriggers(triggerStatement)
          )
        }
   
      </div>
    </>
  );
}

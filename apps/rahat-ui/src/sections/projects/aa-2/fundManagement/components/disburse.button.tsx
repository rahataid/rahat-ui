import { useDisburseChain, useProjectStore } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
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
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { Project } from '@rahataid/sdk/project/project.types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

type DisburseButtonProps = {
  groupUuid?: string;
  status?: string;
};

export default function DisburseButton({
  groupUuid,
  status,
}: DisburseButtonProps) {
  const { id } = useParams();
  const projectId = id as UUID;
  const project = useProjectStore((state) => state.singleProject) as Project;
  const disburse = useDisburseChain(projectId);

  if (project?.type !== 'cva') return null;

  const isDisbursed = status === 'DISBURSED';

  const handleDisburse = () => {
    disburse.mutate({
      dName: `disburse-${new Date().toISOString()}`,
      groups: groupUuid ? [groupUuid] : [],
    });
  };

  const buttonLabel = disburse.isPending
    ? 'Disbursing...'
    : groupUuid
    ? 'Disburse'
    : 'Disburse All';

  return (
    <AlertDialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <AlertDialogTrigger asChild>
                <Button disabled={disburse.isPending || isDisbursed}>
                  {buttonLabel}
                </Button>
              </AlertDialogTrigger>
            </span>
          </TooltipTrigger>
          {isDisbursed && (
            <TooltipContent>Already completed disbursement</TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Disburse fund?</AlertDialogTitle>
          <AlertDialogDescription>
            Fund will be disbursed. Are you sure you want to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDisburse}
            disabled={disburse.isPending}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

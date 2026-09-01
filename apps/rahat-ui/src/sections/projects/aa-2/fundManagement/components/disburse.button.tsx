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

export default function DisburseButton() {
  const { id } = useParams();
  const projectId = id as UUID;
  const project = useProjectStore((state) => state.singleProject) as Project;
  const disburse = useDisburseChain(projectId);

  if (project?.type !== 'cva') return null;

  const handleDisburse = () => {
    disburse.mutate({
      dName: `disburse-${new Date().toISOString()}`,
      groups: [],
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={disburse.isPending}>
          {disburse.isPending ? 'Disbursing...' : 'Disburse'}
        </Button>
      </AlertDialogTrigger>
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

import * as React from 'react';
import { useParams } from 'next/navigation';
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
import { useDeleteStakeholdersGroups } from '@rahat-ui/query';
import { Minus, Trash2, FilePenLine } from 'lucide-react';
import { UUID } from 'crypto';
import EditStakeholdersGroups from './edit.stakeholders.groups';

type IProps = {
  stakeholdersGroupDetail: any;
  closeSecondPanel: VoidFunction;
};

export default function StakeholdersGroupsDetailView({
  stakeholdersGroupDetail,
  closeSecondPanel,
}: IProps) {
  const [showEdit, setShowEdit] = React.useState(false);
  const { id } = useParams();
  const deleteStakeholdersGroup = useDeleteStakeholdersGroups();

  const removeStakeholdersGroup = (groupUUID: string) => {
    deleteStakeholdersGroup.mutateAsync({
      projectUUID: id as UUID,
      stakeholdersGroupPayload: { uuid: groupUUID },
    });
  };

  React.useEffect(() => {
    deleteStakeholdersGroup.isSuccess && closeSecondPanel();
  }, [deleteStakeholdersGroup]);

  return (
    <>
      <div className="py-5 px-2 bg-secondary flex justify-between">
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
        <div className="flex gap-4">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger onClick={() => setShowEdit(!showEdit)}>
                <FilePenLine size={20} strokeWidth={1.5} />
              </TooltipTrigger>
              <TooltipContent className="bg-secondary ">
                <p className="text-xs font-medium">Edit</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
                        delete this stakeholders group.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          removeStakeholdersGroup(stakeholdersGroupDetail?.uuid)
                        }
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
      {!showEdit ? (
        <div className="flex flex-col gap-2 m-2 p-2 border rounded">
          <h1 className="p-2 font-semibold text-lg bg-secondary">
            Group Detail
          </h1>
          <div className="pl-2">
            <h1 className="font-semibold">Group Name</h1>
            <p>{stakeholdersGroupDetail?.name}</p>
          </div>
          <div className="pl-2">
            <h1 className="font-semibold">Members</h1>
            {stakeholdersGroupDetail?.stakeholders?.map((member: any) => (
              <p>
                {member?.name} ({member?.designation})
              </p>
            ))}
          </div>
        </div>
      ) : (
        <EditStakeholdersGroups
          stakeholdersGroupDetail={stakeholdersGroupDetail}
        />
      )}
    </>
  );
}

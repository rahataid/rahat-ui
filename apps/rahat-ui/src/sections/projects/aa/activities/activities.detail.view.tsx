import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
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
import { FilePenLine, Minus, Trash2 } from 'lucide-react';
import { IActivitiesItem } from 'apps/rahat-ui/src/types/activities';
import EditActivityView from './edit.activity.view';
import { useDeleteActivities } from '@rahat-ui/query';
import { UUID } from 'crypto';
import ActivityCommunicationForm from './activity.communication.form';
import ActivityCommunicationTrigger from './activity.communication.trigger';

type IProps = {
  activityDetail: IActivitiesItem;
  closeSecondPanel: VoidFunction;
};

export default function ActivitiesDetail({
  activityDetail,
  closeSecondPanel,
}: IProps) {
  const { id } = useParams();
  const deleteActivity = useDeleteActivities();
  const [showEdit, setShowEdit] = useState(false);

  const removeActivity = (activity: any) => {
    deleteActivity.mutateAsync({
      projectUUID: id as UUID,
      activityPayload: {
        uuid: activity,
      },
    });
  };

  useEffect(() => {
    deleteActivity.isSuccess && closeSecondPanel();
  }, [deleteActivity]);
  console.log(activityDetail);
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
                        delete this activity.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => removeActivity(activityDetail.id)}
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
          Activity Detail
        </h1>
        <div className="pl-2">
          <h1 className="font-semibold">Activity File</h1>
          <p>{activityDetail?.title}</p>
        </div>
        <div className="pl-2">
          <h1 className="font-semibold">Responsibility</h1>
          <p>{activityDetail?.responsibility}</p>
        </div>
        <div className="pl-2">
          <h1 className="font-semibold">Source</h1>
          <p>{activityDetail?.source}</p>
        </div>
        <div className="flex gap-2 pl-2">
          <h1 className="font-semibold">Phase :</h1>
          <p>{activityDetail?.phase}</p>
        </div>
        <div className="pl-2">
          <h1 className="font-semibold">Activity Type</h1>
          <p>{activityDetail?.activityType}</p>
        </div>
      </div>
      {activityDetail?.activityType === 'COMMUNICATION' &&
        activityDetail?.campaignId && (
          <ActivityCommunicationTrigger
            campaignId={activityDetail?.campaignId}
            groupName={activityDetail?.activtiyComm?.stakeholdersGroup?.name}
          />
        )}

      {activityDetail?.activityType === 'COMMUNICATION' &&
        !activityDetail?.campaignId && (
          <ActivityCommunicationForm activityId={activityDetail?.id} />
        )}

      {showEdit && <EditActivityView />}
    </>
  );
}

import { Back, Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { Edit, Pencil, RefreshCcw, Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { DocumentList } from '../components/documentCard';
import CommunicationList from './activity.communication.list.card';
import ActivityDetailCards from './activity.detail.cards';
import { useDeleteActivities, useSingleActivity } from '@rahat-ui/query';
import React from 'react';

export default function ActivitiesDetailView() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;
  const activityId = params.activityID as UUID;

  const activitiesListPath = `/projects/aa/${projectId}/activities`;

  const { data: activityDetail, isLoading = false } = useSingleActivity(
    projectId,
    activityId,
  );

  const deleteActivity = useDeleteActivities();

  const removeActivity = () => {
    deleteActivity.mutateAsync({
      projectUUID: projectId,
      activityPayload: {
        uuid: activityId,
      },
    });
  };

  React.useEffect(() => {
    deleteActivity.isSuccess && router.push(activitiesListPath);
  }, [deleteActivity.isSuccess]);

  return (
    <div className="h-[calc(100vh-65px)] p-4">
      <div className="flex flex-col space-y-0">
        <Back
          path={`/projects/aa/${projectId}/activities/list/${activityDetail?.phase?.name.toLowerCase()}`}
        />

        <div className="mt-4 flex justify-between items-center">
          <div>
            <Heading
              title={`Activity Details`}
              description="Track all the trigger reports here"
            />
          </div>
          <div className="flex space-x-3">
            <IconLabelBtn
              Icon={Trash}
              handleClick={() => removeActivity()}
              name="Delete"
              variant="outline"
              className="rounded-sm w-full text-red-500 border-red-500"
            />
            <IconLabelBtn
              Icon={Pencil}
              handleClick={() =>
                router.push(
                  `/projects/aa/${projectId}/activities/${activityId}/edit`,
                )
              }
              name="Edit"
              variant="outline"
              className="rounded-sm w-full"
            />
            <IconLabelBtn
              Icon={RefreshCcw}
              handleClick={() =>
                router.push(
                  `/projects/aa/${projectId}/activities/${activityId}/update-status`,
                )
              }
              name="Update Status"
              className="rounded-sm w-full"
            />
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 h-[calc(100vh-200px)] gap-3">
        <div className="flex flex-col gap-2 w-full">
          <ActivityDetailCards
            activityDetail={activityDetail}
            loading={isLoading}
          />
          <DocumentList
            documents={activityDetail?.activityDocuments}
            loading={isLoading}
          />
        </div>
        <CommunicationList
          activityCommunication={activityDetail?.activityCommunication}
          loading={isLoading}
        />
      </div>
    </div>
  );
}

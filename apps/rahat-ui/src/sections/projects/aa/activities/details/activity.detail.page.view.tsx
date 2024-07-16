import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ActivityDetailCard from './activity.detail.card';
import ActivityDetailCards from './activity.detail.cards';
import ActivityCommunicationListCard from './activity.communication.list.card';
// import ActivityPayoutCard from './activity.payout.card';
import { useDeleteActivities, useSingleActivity } from '@rahat-ui/query';
import { UUID } from 'crypto';
import Loader from 'apps/rahat-ui/src/components/table.loader';
import EditButton from '../../../components/edit.btn';
import DeleteButton from '../../../components/delete.btn';

export default function ActivitiesDetailView() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;
  const activityId = params.activityID as UUID;

  const activitiesListPath = `/projects/aa/${projectId}/activities`;
  const activitiesEditPath = `/projects/aa/${projectId}/activities/${activityId}/edit`;

  const { data: activityDetail, isLoading } = useSingleActivity(
    projectId,
    activityId,
  );

  const deleteActivity = useDeleteActivities();

  const removeActivity = (activity: any) => {
    deleteActivity.mutateAsync({
      projectUUID: projectId,
      activityPayload: {
        uuid: activity,
      },
    });
  };

  React.useEffect(() => {
    deleteActivity.isSuccess && router.push(activitiesListPath);
  }, [deleteActivity.isSuccess]);

  return isLoading ? (
    <Loader />
  ) : (
    <div className="h-[calc(100vh-65px)] bg-secondary p-4">
      <div className="flex justify-between">
        <div className="flex gap-4 items-center">
          <ArrowLeft
            size={25}
            strokeWidth={1.5}
            className="cursor-pointer"
            onClick={() => router.back()}
          />
          <h1 className="text-xl font-semibold">{activityDetail?.title}</h1>
        </div>
        <div className="flex gap-4 items-center">
          <EditButton path={activitiesEditPath} />
          <DeleteButton
            name="activity"
            handleContinueClick={() => removeActivity(activityDetail.uuid)}
          />
        </div>
      </div>
      <ActivityDetailCards
        activityDetail={activityDetail}
        loading={isLoading}
      />
      <div className="grid grid-cols-2 gap-4 mt-4">
        <ActivityDetailCard activityDetail={activityDetail} />
        <ActivityCommunicationListCard
          activityDetail={activityDetail}
          projectId={projectId}
        />
        {/* <ActivityPayoutCard /> */}
      </div>
    </div>
  );
}

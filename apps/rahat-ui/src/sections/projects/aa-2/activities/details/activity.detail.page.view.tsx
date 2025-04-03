import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import ActivityDetailCard from './activity.detail.card';
import ActivityDetailCards from './activity.detail.cards';
import ActivityCommunicationListCard from './activity.communication.list.card';
import { useDeleteActivities, useSingleActivity } from '@rahat-ui/query';
import { UUID } from 'crypto';
import {
  Back,
  Heading,
  IconLabelBtn,
  NoResult,
  SpinnerLoader,
  TableLoader,
} from 'apps/rahat-ui/src/common';
import { Edit, RefreshCcw, Trash } from 'lucide-react';
import { DocumentList } from '../components/documentCard';
import CommunicationList from './activity.communication.list.card';

const dummyDocuments: any[] = [
  { filename: 'Importantfilename', date: '22 July, 2023' },
  { filename: 'Importantfilename.pdf', date: '22 July, 2023' },
  { filename: 'Importantfilename', date: '22 July, 2023' },
  { filename: 'Importantfilename.pdf', date: '22 July, 2023' },
];

export default function ActivitiesDetailView() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;
  const activityId = params.activityID as UUID;

  const activitiesListPath = `/projects/aa/${projectId}/activities`;

  // const { data: activityDetail, isLoading = false } = useSingleActivity(
  //   projectId,
  //   activityId,
  // );

  // const deleteActivity = useDeleteActivities();

  // const removeActivity = (activity: any) => {
  //   deleteActivity.mutateAsync({
  //     projectUUID: projectId,
  //     activityPayload: {
  //       uuid: activity,
  //     },
  //   });
  // };

  // React.useEffect(() => {
  //   deleteActivity.isSuccess && router.push(activitiesListPath);
  // }, [deleteActivity.isSuccess]);

  return (
    <div className="h-[calc(100vh-65px)]  p-4">
      <div className="flex flex-col space-y-0">
        <Back path={`/projects/aa/${projectId}/activities`} />

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
              // handleClick={() => () => removeActivity(activityDetail.uuid)}
              handleClick={() => {}}
              name="Delete"
              variant="outline"
              className="rounded-sm w-full text-red-500 border-red-500"
            />
            <IconLabelBtn
              Icon={Edit}
              handleClick={() =>
                router.push(
                  `/projects/aa/${projectId}/activities/${activityId}/edit`,
                )
              }
              name="Download"
              variant="outline"
              className="rounded-sm w-full"
            />
            <IconLabelBtn
              Icon={RefreshCcw}
              // handleClick={() => () => removeActivity(activityDetail.uuid)}
              handleClick={() => {}}
              name="Update Status"
              className="rounded-sm w-full"
            />
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 h-[calc(100vh-200px)] gap-3">
        <div className="flex flex-col gap-2 w-full">
          <ActivityDetailCards />
          <DocumentList documents={dummyDocuments} />
        </div>
        <CommunicationList />
      </div>
    </div>
  );
}

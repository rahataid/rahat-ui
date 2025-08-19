import { Back, Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { Edit, Pencil, RefreshCcw, Trash } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { DocumentList } from '../components/documentCard';
import CommunicationList from './activity.communication.list.card';
import ActivityDetailCards from './activity.detail.cards';
import { useDeleteActivities, useSingleActivity } from '@rahat-ui/query';
import React from 'react';
import { DialogComponent } from './dialog.reuse';
import { AARoles, RoleAuth } from '@rahat-ui/auth';

export default function ActivitiesDetailView() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;
  const activityId = params.activityID as UUID;
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('from');

  const { data: activityDetail, isLoading = false } = useSingleActivity(
    projectId,
    activityId,
  );
  const activitiesListPath = redirectTo
    ? `/projects/aa/${projectId}/activities`
    : `/projects/aa/${projectId}/activities/list/${activityDetail?.phase?.name.toLowerCase()}`;

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
      <div className="flex gap-2 justify-between">
        <div className="flex flex-col gap-2">
          <Back path={activitiesListPath} />
          <Heading
            title={`Activity Details`}
            description="Detailed view of selected activity"
            titleStyle="text-xl sm:text-4xl "
          />
        </div>

        <div className="flex flex-col gap-2 lg:flex-row items-center justify-center">
          <div className="flex space-x-2">
            <RoleAuth
              roles={[AARoles.ADMIN, AARoles.MANAGER]}
              hasContent={false}
            >
              <DialogComponent
                buttonIcon={Trash}
                buttonText="Delete"
                dialogTitle="Delete Activity"
                dialogDescription="Are you sure you want to delete this activity?"
                confirmButtonText="Remove"
                handleClick={() => removeActivity()}
                buttonClassName="rounded-sm w-full text-red-500 border-red-500 sm"
                confirmButtonClassName="rounded-sm w-full bg-red-500"
                variant="outline"
              />
            </RoleAuth>

            <RoleAuth
              roles={[AARoles.ADMIN, AARoles.MANAGER]}
              hasContent={false}
            >
              <DialogComponent
                buttonIcon={Pencil}
                buttonText="Edit"
                dialogTitle="Edit Activity"
                dialogDescription="Are you sure you want to edit this activity?"
                confirmButtonText="Edit"
                handleClick={() =>
                  router.push(
                    `/projects/aa/${projectId}/activities/${activityId}/edit`,
                  )
                }
                buttonClassName="rounded-sm w-full"
                confirmButtonClassName="rounded-sm w-full bg-primary"
                variant="outline"
              />
            </RoleAuth>
          </div>
          <RoleAuth roles={[AARoles.ADMIN, AARoles.MANAGER]} hasContent={false}>
            <IconLabelBtn
              Icon={RefreshCcw}
              handleClick={() =>
                router.push(
                  `/projects/aa/${projectId}/activities/${activityId}/update-status?from=detailPage${
                    redirectTo ? `&backFrom=${redirectTo}` : ''
                  }`,
                )
              }
              name="Update Status"
              className="rounded-sm w-full "
            />
          </RoleAuth>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-3 w-full">
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

import { useTranslations } from 'next-intl';
import {
  Back,
  Heading,
  IconLabelBtn,
  NoResult,
} from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { Pencil, RefreshCcw, Trash } from 'lucide-react';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { DocumentList } from '../components/documentCard';
import CommunicationList from './activity.communication.list.card';
import ActivityDetailCards from './activity.detail.cards';
import { useDeleteActivities, useSingleActivity } from '@rahat-ui/query';
import React from 'react';
import { DialogComponent } from './dialog.reuse';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import Loader from 'apps/community-tool-ui/src/components/Loader';

export default function ActivitiesDetailView() {
  const t = useTranslations('AA_PROJECT');
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;
  const activityId = params.activityID as UUID;
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('from');

  const {
    data: activityDetail,
    isLoading,
    error,
  } = useSingleActivity(projectId, activityId);
  const activitiesListPath = redirectTo
    ? `/projects/aa/${projectId}/activities/list/${redirectTo}`
    : `/projects/aa/${projectId}/activities`;

  const redirectUpdatePath = redirectTo
    ? `/projects/aa/${projectId}/activities/${activityId}/edit?${
        redirectTo ? `&backFrom=${redirectTo}` : ''
      }`
    : `/projects/aa/${projectId}/activities/${activityId}/edit`;

  const deleteActivity = useDeleteActivities();

  const removeActivity = async () => {
    try {
      await deleteActivity.mutateAsync({
        projectUUID: projectId,
        activityPayload: {
          uuid: activityId,
        },
      });
      router.push(activitiesListPath);
    } catch (error) {
      console.error('Error::', error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full p-4">
        <Back path={activitiesListPath} />
        <div className="h-full flex justify-center items-center">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full p-4">
        <Back path={activitiesListPath} />
        <NoResult
          className="h-full flex justify-center items-center"
          message={t('ERROR_LOADING_ACTIVITY_DETAILS')}
        />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-65px)] p-4">
      <div className="flex gap-2 justify-between">
        <div className="flex flex-col gap-2">
          <Back path={activitiesListPath} />
          <Heading
            title={t('ACTIVITY_DETAILS')}
            description={t('DETAILED_VIEW_OF_SELECTED_ACTIVITY')}
            titleStyle="text-xl sm:text-4xl "
          />
        </div>
        {activityDetail && (
          <div className="flex flex-col gap-2 lg:flex-row items-center justify-center">
            <div className="flex space-x-2">
              <RoleAuth
                roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}
                hasContent={false}
              >
                <TooltipWrapper tip={t('DELETE_ACTIVITY')}>
                  <DialogComponent
                    buttonIcon={Trash}
                    buttonText={t('DELETE')}
                    dialogTitle={t('DELETE_ACTIVITY')}
                    dialogDescription={t('DELETE_ACTIVITY_CONFIRM')}
                    confirmButtonText={t('REMOVE')}
                    handleClick={() => removeActivity()}
                    buttonClassName="rounded-sm w-full text-red-500 border-red-500 sm"
                    confirmButtonClassName="rounded-sm w-full bg-red-500"
                    variant="outline"
                  />
                </TooltipWrapper>
              </RoleAuth>

              <RoleAuth
                roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}
                hasContent={false}
              >
                <TooltipWrapper tip={t('EDIT_ACTIVITY')}>
                  <DialogComponent
                    buttonIcon={Pencil}
                    buttonText={t('EDIT')}
                    dialogTitle={t('EDIT_ACTIVITY')}
                    dialogDescription={t('EDIT_ACTIVITY_CONFIRM')}
                    confirmButtonText={t('EDIT')}
                    handleClick={() => router.push(redirectUpdatePath)}
                    buttonClassName="rounded-sm w-full"
                    confirmButtonClassName="rounded-sm w-full bg-primary"
                    variant="outline"
                  />
                </TooltipWrapper>
              </RoleAuth>
            </div>
            <RoleAuth
              roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}
              hasContent={false}
            >
              <TooltipWrapper tip={t('UPDATE_ACTIVITY_STATUS')}>
                <IconLabelBtn
                  Icon={RefreshCcw}
                  handleClick={() =>
                    router.push(
                      `/projects/aa/${projectId}/activities/${activityId}/update-status?from=detailPage${
                        redirectTo ? `&backFrom=${redirectTo}` : ''
                      }`,
                    )
                  }
                  name={t('UPDATE_STATUS')}
                  className="rounded-sm w-full "
                />
              </TooltipWrapper>
            </RoleAuth>
          </div>
        )}
      </div>
      {activityDetail ? (
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
      ) : (
        <NoResult />
      )}
    </div>
  );
}

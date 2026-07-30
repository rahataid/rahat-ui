'use client';
import { useTranslations } from 'next-intl';
import { SpinnerLoader } from 'apps/rahat-ui/src/common';
import { CheckCircle, Clock, NotepadText, UserCircle } from 'lucide-react';
import * as React from 'react';
import { getStatusBg } from 'apps/rahat-ui/src/utils/get-status-bg';
import { useDateFormat } from 'apps/rahat-ui/src/utils/useDateFormat';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';
type ActivityDetailCardsProps = {
  activityDetail?: any;
  loading?: boolean;
};

export default function ActivityDetailCards({
  activityDetail,
  loading,
}: ActivityDetailCardsProps) {
  const t = useTranslations('AA_PROJECT');
  const formatDate = useDateFormat();
  if (loading) {
    <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-200 h-[calc(29vh)]">
      <SpinnerLoader />
    </div>;
  }
  return (
    <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-200  w-full">
      {loading ? (
        <SpinnerLoader />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <TooltipWrapper tip={`${t('PHASE')}: ${activityDetail?.phase?.name}`}>
              <span className="bg-green-100 text-green-700 text-xs font-normal px-2 py-1 rounded-sm cursor-pointer">
                {activityDetail?.phase?.name}
              </span>
            </TooltipWrapper>

            <TooltipWrapper
              tip={`${t('ACTIVITY_TYPE')}: ${
                activityDetail?.isAutomated ? t('AUTOMATED') : t('MANUAL')
              }`}
            >
              <span className="bg-gray-100 text-gray-700 text-xs font-normal px-2 py-1 rounded-sm cursor-pointer">
                {activityDetail?.isAutomated ? t('AUTOMATED') : t('MANUAL')}
              </span>
            </TooltipWrapper>

            <TooltipWrapper tip={`${t('CATEGORY')}: ${activityDetail?.category?.name}`}>
              <span className="bg-gray-100 text-gray-700 text-xs font-normal px-2 py-1 rounded-sm cursor-pointer">
                {activityDetail?.category?.name}
              </span>
            </TooltipWrapper>

            {/* getStatusBg(status) */}
            <div className="ml-auto">
              <TooltipWrapper
                tip={`${t('ACTIVITY_STATUS')}: ${activityDetail?.status
                  ?.toLowerCase()
                  ?.split('_')
                  ?.map(
                    (word) => word?.charAt(0)?.toUpperCase() + word?.slice(1),
                  )
                  ?.join(' ')}`}
              >
                <span
                  className={`${getStatusBg(
                    activityDetail?.status,
                  )} text-xs font-normal px-2 py-1 rounded-sm cursor-pointer`}
                >
                  {activityDetail?.status
                    ?.toLowerCase()
                    ?.split('_')
                    ?.map(
                      (word) => word?.charAt(0)?.toUpperCase() + word?.slice(1),
                    )
                    ?.join(' ')}
                </span>
              </TooltipWrapper>
            </div>
          </div>
          <TooltipWrapper tip={`${t('ACTIVITY_TITLE')}: ${activityDetail?.title}`}>
            <h3 className="text-lg font-semibold text-gray-900 leading-tight truncate w-[420px] cursor-pointer">
              {activityDetail?.title}
            </h3>
          </TooltipWrapper>

          {activityDetail?.description && (
            <TooltipWrapper                 tip={`${t('DESCRIPTION')}: ${activityDetail?.description}`}>
              <p className="text-gray-600 text-sm mt-1 leading-tight cursor-pointer">
                {activityDetail?.description?.substring(0, 100)}...
              </p>
            </TooltipWrapper>
          )}
          <div className="text-gray-500 text-sm mt-2 flex flex-wrap gap-2">
            <TooltipWrapper
              tip={`${t('RESPONSIBLE_STATION')}: ${
                activityDetail?.responsibleStation ?? 'N/A'
              }`}
            >
              <span className="cursor-pointer">
                {activityDetail?.responsibleStation &&
                activityDetail.responsibleStation.length > 20
                  ? `${activityDetail.responsibleStation.substring(0, 20)}...`
                  : activityDetail?.responsibleStation ?? 'N/A'}
              </span>
            </TooltipWrapper>

            <TooltipWrapper
              tip={`${t('LEAD_TIME')}: ${activityDetail?.leadTime ?? 'N/A'}`}
            >
              <span className="cursor-pointer">
                {activityDetail?.leadTime && <span>&bull;</span>}
                {activityDetail?.leadTime ?? 'N/A'}
              </span>
            </TooltipWrapper>
          </div>
          <div className="flex items-center text-gray-500 text-sm mt-1">
            <UserCircle className="w-4 h-4 mr-2 ml-1" />
            <TooltipWrapper
              tip={`${t('RESPONSIBILITY')}: ${activityDetail?.manager?.name}`}
            >
              <span className="cursor-pointer">
                {t('ASSIGNED_TO')}: {activityDetail?.manager?.name}
              </span>
            </TooltipWrapper>
          </div>
          {activityDetail?.completedBy && (
            <div className="flex items-center text-green-700 text-xs mt-2">
              <CheckCircle className="w-4 h-4 mr-2 ml-1" />
              <TooltipWrapper
                tip={`${t('COMPLETED_BY')}: ${activityDetail?.completedBy}`}
              >
                <span className="cursor-pointer">
                  {activityDetail?.completedBy}
                </span>
              </TooltipWrapper>
            </div>
          )}
          {activityDetail?.completedAt && (
            <div className="flex items-center text-green-700 text-xs mt-2">
              <Clock className="w-4 h-4 mr-2 ml-1" />
              <TooltipWrapper
                tip={`${t('COMPLETED_AT')}: ${formatDate(activityDetail?.completedAt)}`}
              >
                <span className="cursor-pointer">
                  {t('COMPLETED_AT')}: {formatDate(activityDetail?.completedAt)}
                </span>
              </TooltipWrapper>
            </div>
          )}
          {activityDetail?.notes?.trim() && (
            <TooltipWrapper tip={activityDetail.notes}>
              <div className="flex items-start text-xs mt-1 space-x-2 cursor-pointer">
                <NotepadText className="w-4 h-3.5 flex-shrink-0 mt-0.5" />
                <span className="break-words text-justify truncate w-[620px]">
                  {activityDetail.notes}
                </span>
              </div>
            </TooltipWrapper>
          )}
        </>
      )}
    </div>
  );
}

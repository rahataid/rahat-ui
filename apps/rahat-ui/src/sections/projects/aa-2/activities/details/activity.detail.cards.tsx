'use client';
import { useTranslations } from 'next-intl';
import { SpinnerLoader } from 'apps/rahat-ui/src/common';
import { CheckCircle, Clock, NotepadText, UserCircle } from 'lucide-react';
import * as React from 'react';
import { getStatusBg } from 'apps/rahat-ui/src/utils/get-status-bg';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';
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
  const tg = useTranslations('GLOBAL');
  const formatDate = useDateFormat();
  const formatDigits = useLabelDigits();

  // leadTime is stored as "<value> <unit>" (e.g. "1 Days"); translate the
  // unit word and transliterate the digit for display only.
  const formatLeadTime = (value?: string) => {
    if (!value) return undefined;
    const match = value.match(/^(\d+)\s*(hours?|days?)$/i);
    if (!match) return value;
    const [, num, unit] = match;
    const unitKey = unit.toLowerCase().startsWith('hour') ? 'HOURS' : 'DAYS';
    return `${formatDigits(num)} ${t(unitKey)}`;
  };
  const formattedLeadTime = formatLeadTime(activityDetail?.leadTime);

  const getStatusLabel = (status?: string) => {
    return translateValue(tg, status);
  };
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
            <TooltipWrapper tip={`${t('PHASE')}: ${activityDetail?.phase?.name || tg('N_A')}`}>
              <span className="bg-green-100 text-green-700 text-xs font-normal px-2 py-1 rounded-sm cursor-pointer">
                {activityDetail?.phase?.name || tg('N_A')}
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

            <TooltipWrapper tip={`${t('CATEGORY')}: ${activityDetail?.category?.name || tg('N_A')}`}>
              <span className="bg-gray-100 text-gray-700 text-xs font-normal px-2 py-1 rounded-sm cursor-pointer">
                {activityDetail?.category?.name || tg('N_A')}
              </span>
            </TooltipWrapper>

            {/* getStatusBg(status) */}
            <div className="ml-auto">
              <TooltipWrapper
                tip={`${t('ACTIVITY_STATUS')}: ${getStatusLabel(
                  activityDetail?.status,
                )}`}
              >
                <span
                  className={`${getStatusBg(
                    activityDetail?.status,
                  )} text-xs font-normal px-2 py-1 rounded-sm cursor-pointer`}
                >
                  {getStatusLabel(activityDetail?.status)}
                </span>
              </TooltipWrapper>
            </div>
          </div>
          <TooltipWrapper tip={`${t('ACTIVITY_TITLE')}: ${activityDetail?.title || tg('N_A')}`}>
            <h3 className="text-lg font-semibold text-gray-900 leading-tight truncate max-w-full cursor-pointer">
              {activityDetail?.title || tg('N_A')}
            </h3>
          </TooltipWrapper>

          {activityDetail?.description && (
            <TooltipWrapper                 tip={`${t('DESCRIPTION')}: ${activityDetail?.description}`}>
              <p className="text-gray-600 text-sm mt-1 leading-tight truncate max-w-full cursor-pointer">
                {activityDetail?.description}
              </p>
            </TooltipWrapper>
          )}
          <div className="text-gray-500 text-sm mt-2 flex flex-wrap gap-2">
            <TooltipWrapper
              tip={`${t('RESPONSIBLE_STATION')}: ${
                activityDetail?.responsibleStation ?? tg('N_A')
              }`}
            >
              <span className="cursor-pointer">
                {activityDetail?.responsibleStation &&
                activityDetail.responsibleStation.length > 20
                  ? `${activityDetail.responsibleStation.substring(0, 20)}...`
                  : activityDetail?.responsibleStation ?? tg('N_A')}
              </span>
            </TooltipWrapper>

            <TooltipWrapper
              tip={`${t('LEAD_TIME')}: ${formattedLeadTime ?? tg('N_A')}`}
            >
              <span className="cursor-pointer">
                {activityDetail?.leadTime && <span>&bull;</span>}
                {formattedLeadTime ?? tg('N_A')}
              </span>
            </TooltipWrapper>
          </div>
          <div className="flex items-center text-gray-500 text-sm mt-1">
            <UserCircle className="w-4 h-4 mr-2 ml-1" />
            <TooltipWrapper
              tip={`${t('RESPONSIBILITY')}: ${activityDetail?.manager?.name || tg('N_A')}`}
            >
              <span className="cursor-pointer">
                {t('ASSIGNED_TO')}: {activityDetail?.manager?.name || tg('N_A')}
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

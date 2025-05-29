'use client';
import { SpinnerLoader } from 'apps/rahat-ui/src/common';
import { CheckCircle, Clock, UserCircle } from 'lucide-react';
import * as React from 'react';
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import { getStatusBg } from 'apps/rahat-ui/src/utils/get-status-bg';
type ActivityDetailCardsProps = {
  activityDetail?: any;
  loading?: boolean;
};

export default function ActivityDetailCards({
  activityDetail,
  loading,
}: ActivityDetailCardsProps) {
  function formatToNepalTime(utcDateString) {
    const utcDate = new Date(utcDateString);

    const nepalTimeFormatter = new Intl.DateTimeFormat('en-NP', {
      timeZone: 'Asia/Kathmandu',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    return nepalTimeFormatter.format(utcDate);
  }

  if (loading) {
    <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-200 h-[calc(29vh)]">
      <SpinnerLoader />
    </div>;
  }
  return (
    <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-200 h-[calc(29vh)] w-full">
      {loading ? (
        <SpinnerLoader />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="bg-green-100 text-green-700 text-xs font-normal px-2 py-1 rounded-sm">
              {activityDetail?.phase?.name}
            </span>
            <span className="bg-gray-100 text-gray-700 text-xs font-normal px-2 py-1 rounded-sm">
              {activityDetail?.isAutomated ? 'Automated' : 'Manual'}
            </span>
            <span className="bg-gray-100 text-gray-700 text-xs font-normal px-2 py-1 rounded-sm">
              {activityDetail?.category?.name}
            </span>
            {/* getStatusBg(status) */}
            <span
              className={`ml-auto ${getStatusBg(
                activityDetail?.status,
              )} text-xs font-normal px-2 py-1 rounded-sm`}
            >
              {activityDetail?.status
                .toLowerCase()
                .split('_')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild className="hover:cursor-pointer py-0">
                <h3 className="text-lg font-semibold text-gray-900 leading-tight truncate ">
                  {activityDetail?.title}...
                </h3>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="w-80 rounded-sm text-justify "
              >
                <p>{activityDetail?.title}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild className="hover:cursor-pointer">
                <p className="text-gray-600 text-sm mt-1  leading-tight">
                  {activityDetail?.description?.substring(0, 100)}...
                </p>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="w-80 rounded-sm text-justify"
              >
                <p>{activityDetail?.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="text-gray-500 text-sm mt-2 flex flex-wrap gap-2">
            <span>{activityDetail?.phase?.riverBasin}</span>
            <span>&bull;</span>
            <span>{activityDetail?.leadTime}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm mt-1">
            <UserCircle className="w-4 h-4 mr-2 ml-1" />
            <span>Assigned to: {activityDetail?.manager?.name}</span>
          </div>
          {activityDetail?.completedBy && (
            <div className="flex items-center text-green-700 text-xs mt-2">
              <>
                <CheckCircle className="w-4 h-4 mr-2 ml-1" />
                <span>{activityDetail?.completedBy}</span>
              </>
            </div>
          )}
          {activityDetail?.completedAt && (
            <div className="flex items-center text-green-700 text-xs mt-2">
              <>
                <Clock className="w-4 h-4 mr-2 ml-1" />
                <span>
                  Completed at: {formatToNepalTime(activityDetail?.completedAt)}
                </span>
              </>
            </div>
          )}
        </>
      )}
    </div>
  );
}

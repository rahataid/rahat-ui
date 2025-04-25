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
type ActivityDetailCardsProps = {
  activityDetail?: any;
  loading?: boolean;
};

export default function ActivityDetailCards({
  activityDetail,
  loading,
}: ActivityDetailCardsProps) {
  if (loading) {
    <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-200 h-[calc(29vh)]">
      <SpinnerLoader />
    </div>;
  }
  return (
    <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-200 h-[calc(29vh)]">
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
            <span className="ml-auto bg-gray-100 text-gray-700 text-xs font-normal px-2 py-1 rounded-sm">
              {activityDetail?.status}
            </span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild className="hover:cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900 truncate ">
                  {activityDetail?.title}
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
                <p className="text-gray-600 text-sm mt-1 truncate w-48 ">
                  {activityDetail?.description}
                </p>
              </TooltipTrigger>
              <TooltipContent
                side="right"
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
          <div className="flex items-center text-gray-500 text-sm mt-2">
            <UserCircle className="w-4 h-4 mr-2 ml-1" />
            <span>Assigned to: {activityDetail?.manager?.name}</span>
          </div>
          {activityDetail?.completedBy && (
            <div className="flex items-center text-green-700 text-xs mt-2">
              <>
                <CheckCircle className="w-4 h-4 mr-2 ml-1" />
                <span>NPT: {activityDetail?.completedBy}</span>
              </>
            </div>
          )}
          {activityDetail?.completedAt && (
            <div className="flex items-center text-green-700 text-xs mt-2">
              <>
                <Clock className="w-4 h-4 mr-2 ml-1" />
                <span>Completed at: {activityDetail?.completedAt}</span>
              </>
            </div>
          )}
        </>
      )}
    </div>
  );
}

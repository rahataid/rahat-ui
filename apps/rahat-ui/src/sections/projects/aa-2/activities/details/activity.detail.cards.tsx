'use client';
import { SpinnerLoader } from 'apps/rahat-ui/src/common';
import { CheckCircle, Clock, NotepadText, UserCircle } from 'lucide-react';
import * as React from 'react';
import { getStatusBg } from 'apps/rahat-ui/src/utils/get-status-bg';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import TooltipChildren from 'apps/rahat-ui/src/components/tooltip.children';
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
    <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-200  w-full">
      {loading ? (
        <SpinnerLoader />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <TooltipChildren tip={`Phase: ${activityDetail?.phase?.name}`}>
              <span className="bg-green-100 text-green-700 text-xs font-normal px-2 py-1 rounded-sm cursor-pointer">
                {activityDetail?.phase?.name}
              </span>
            </TooltipChildren>

            <TooltipChildren
              tip={`Activity Type: ${
                activityDetail?.isAutomated ? 'Automated' : 'Manual'
              }`}
            >
              <span className="bg-gray-100 text-gray-700 text-xs font-normal px-2 py-1 rounded-sm cursor-pointer">
                {activityDetail?.isAutomated ? 'Automated' : 'Manual'}
              </span>
            </TooltipChildren>

            <TooltipChildren
              tip={`Category: ${activityDetail?.category?.name}`}
            >
              <span className="bg-gray-100 text-gray-700 text-xs font-normal px-2 py-1 rounded-sm cursor-pointer">
                {activityDetail?.category?.name}
              </span>
            </TooltipChildren>

            {/* getStatusBg(status) */}
            <div className="ml-auto">
              <TooltipChildren
                tip={`Activity Status: ${activityDetail?.status
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
              </TooltipChildren>
            </div>
          </div>
          <TooltipChildren tip={`Activity Title: ${activityDetail?.title}`}>
            <h3 className="text-lg font-semibold text-gray-900 leading-tight truncate w-[420px] cursor-pointer">
              {activityDetail?.title}
            </h3>
          </TooltipChildren>

          {activityDetail?.description && (
            <TooltipChildren
              tip={`Description: ${activityDetail?.description}`}
            >
              <p className="text-gray-600 text-sm mt-1 leading-tight cursor-pointer">
                {activityDetail?.description?.substring(0, 100)}...
              </p>
            </TooltipChildren>
          )}
          <div className="text-gray-500 text-sm mt-2 flex flex-wrap gap-2">
            <TooltipChildren
              tip={`Responsible Station: ${activityDetail?.phase?.riverBasin}`}
            >
              <span className="cursor-pointer">
                {activityDetail?.phase?.riverBasin}
              </span>
            </TooltipChildren>
            <span>&bull;</span>
            <TooltipChildren tip={`Lead Time: ${activityDetail?.leadTime}`}>
              <span className="cursor-pointer">{activityDetail?.leadTime}</span>
            </TooltipChildren>
          </div>
          <div className="flex items-center text-gray-500 text-sm mt-1">
            <UserCircle className="w-4 h-4 mr-2 ml-1" />
            <TooltipChildren
              tip={`Responsibility: ${activityDetail?.manager?.name}`}
            >
              <span className="cursor-pointer">
                Assigned to: {activityDetail?.manager?.name}
              </span>
            </TooltipChildren>
          </div>
          {activityDetail?.completedBy && (
            <div className="flex items-center text-green-700 text-xs mt-2">
              <CheckCircle className="w-4 h-4 mr-2 ml-1" />
              <TooltipChildren
                tip={`Completed by: ${activityDetail?.completedBy}`}
              >
                <span className="cursor-pointer">
                  {activityDetail?.completedBy}
                </span>
              </TooltipChildren>
            </div>
          )}
          {activityDetail?.completedAt && (
            <div className="flex items-center text-green-700 text-xs mt-2">
              <Clock className="w-4 h-4 mr-2 ml-1" />
              <TooltipChildren
                tip={`Completed at: ${dateFormat(activityDetail?.completedAt)}`}
              >
                <span className="cursor-pointer">
                  Completed at: {dateFormat(activityDetail?.completedAt)}
                </span>
              </TooltipChildren>
            </div>
          )}
          {activityDetail?.notes?.trim() && (
            <TooltipChildren tip={activityDetail.notes}>
              <div className="flex items-start text-xs mt-1 space-x-2 cursor-pointer">
                <NotepadText className="w-4 h-3.5 flex-shrink-0 mt-0.5" />
                <span className="break-words text-justify truncate w-[620px]">
                  {activityDetail.notes}
                </span>
              </div>
            </TooltipChildren>
          )}
        </>
      )}
    </div>
  );
}

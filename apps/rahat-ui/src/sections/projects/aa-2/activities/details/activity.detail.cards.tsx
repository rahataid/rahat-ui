'use client';
import { CheckCircle, Clock, UserCircle } from 'lucide-react';
import * as React from 'react';

type ActivityDetailCardsProps = {
  activityDetail?: any;
  loading?: boolean;
};

export default function ActivityDetailCards({
  activityDetail,
  loading,
}: ActivityDetailCardsProps) {
  return (
    <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-200 h-[calc(29vh)]">
      <div className="flex flex-wrap items-center gap-2 mb-2">
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
      <h3 className="text-lg font-semibold text-gray-900">
        {activityDetail?.title}
      </h3>
      <p className="text-gray-600 text-sm mt-1">
        {activityDetail?.description}
      </p>
      <div className="text-gray-500 text-sm mt-3 flex flex-wrap gap-2">
        <span>{activityDetail?.phase?.riverBasin}</span>
        <span>&bull;</span>
        <span>{activityDetail?.leadTime}</span>
      </div>
      <div className="flex items-center text-gray-500 text-sm mt-2">
        <UserCircle className="mr-2" />
        <span>Assigned to: {activityDetail?.manager?.name}</span>
      </div>
      {activityDetail?.completedBy && (
        <div className="flex items-center text-green-700 text-sm mt-2">
          <>
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>Completed by: {activityDetail?.completedBy}</span>
          </>
        </div>
      )}
      {activityDetail?.completedAt && (
        <div className="flex items-center text-green-700 text-sm mt-2">
          <>
            <Clock className="w-5 h-5 mr-2" />
            <span>Completed by: {activityDetail?.completedAt}</span>
          </>
        </div>
      )}
    </div>
  );
}

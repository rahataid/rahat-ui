'use client';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetAllNotificatons } from '@rahat-ui/query';
import { formatTimestamp } from '../../utils/dateFormate';
import { Notification } from '@rahat-ui/types';
import { truncateDescription } from '../../utils/truncateDescription';


export default function NotificationsView() {
  const {data: notificationData} = useGetAllNotificatons();
  const lenthOfNotification = notificationData?.response?.meta?.total;

  const router = useRouter();

  const [expanded, setExpanded] = React.useState<{ [key: string]: boolean }>({});

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="flex flex-col">
        <div className="overflow-y-auto">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="absolute top-6 right-8 text-gray-400 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="bg-white rounded-[1rem] shadow-sm w-[50.75rem] h-[52.56rem] p-[2.5rem] gap-[0.875rem] flex flex-col justify-center items-center">
              <div className="flex flex-col gap-1 text-center">
                <div className="flex items-center gap-2 justify-center">
                  <h1 className="text-xl font-semibold text-gray-900">Notifications</h1>
                  {lenthOfNotification > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {lenthOfNotification}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">Here is the list of all your notifications</p>
              </div>

              <div className="flex-1 w-full overflow-y-auto">
                {notificationData?.data?.map((notification: Notification) => {
                  const isExpanded = expanded[notification.id] || false;
                  const truncatedDesc = truncateDescription(notification.description, 60);

                  return (
                    <div
                      key={notification.id}
                      className={`p-4 bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors ${
                        !notification.notify && 'bg-blue-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                                {notification.projectId && (
                                  <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-xs">
                                    {notification.project.name}
                                  </span>
                                )}
                              </div>

                              {notification.description && (
                                <div className="flex items-center gap-2">
                                  <p className="text-sm text-gray-600">
                                    {isExpanded ? notification.description : truncatedDesc}
                                  </p>
                                </div>
                              )}
                              <p className="text-xs text-gray-500">{formatTimestamp(notification.createdAt)}</p>
                            </div>
                            {!notification.notify && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {notification.description && !isExpanded && (
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => toggleExpand(notification.id)}
                              className="text-blue-600 text-xs p-0 h-auto leading-none flex items-center gap-1"
                            >
                              View all
                              <ChevronDown className='w-4 h-4'/>
                            </Button>
                          )}
                          {notification.description && isExpanded && (
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => toggleExpand(notification.id)}
                              className="text-blue-600 text-xs p-0 h-auto leading-none flex items-center gap-1"
                            >
                              View less
                              <ChevronUp className='w-4 h-4'/>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
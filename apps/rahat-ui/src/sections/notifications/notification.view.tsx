'use client';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { X } from 'lucide-react';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetAllNotificatons } from '@rahat-ui/query';
import { formatTimestamp } from '../../utils/dateFormate';



export default function NotificationsView() {
  const {data:notificationData} = useGetAllNotificatons()
  const  lenthOfNotification = notificationData?.length || 0;

  const router = useRouter();






  const [expanded, setExpanded] = React.useState<{ [key: string]: boolean }>({});
 

 
  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 relative"> 
       
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold text-gray-900">Notifications</h1>
                  {lenthOfNotification > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {lenthOfNotification}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">Here is the list of all your notifications</p>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {notificationData?.map((notification:any) => {
                const isExpanded = expanded[notification.id] || false;

                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.isRead && 'bg-blue-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                              {notification.projectId && (
                                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                                  {notification.projectId}
                                </span>
                              )}
                            </div>
                            {notification.description && (
                              <p
                                className={`text-sm text-gray-600 mb-2 leading-relaxed transition-all duration-300 ${
                                  isExpanded ? 'max-h-[none]' : 'max-h-0 overflow-hidden'
                                }`}
                              >
                                {notification.description}
                              </p>
                            )}
                            <p className="text-xs text-gray-500">{formatTimestamp(notification.createdAt)}</p>
                          </div>
                          {!notification.isRead && (
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
                            className="text-blue-600 text-xs p-0 h-auto leading-none"
                          >
                            View all
                          </Button>
                        )}
                        {notification.description && isExpanded && (
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => toggleExpand(notification.id)}
                            className="text-blue-600 text-xs p-0 h-auto leading-none"
                          >
                            Collapse
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
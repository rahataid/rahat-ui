import React, { useState } from 'react';
import { Notification } from '@rahat-ui/types';
import { formatTimestamp } from '../../utils/dateFormate';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface INotificationTypes {
  notification: Notification;
}

const NotificationItems = ({ notification }: INotificationTypes) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpand = () => {
    setIsExpanded((pre) => !pre);
  };

  return (
    <div
      key={notification.id}
      className={`p-4 bg-[#EAF2FB] hover:bg-[#EAF2FB] cursor-pointer transition-colors rounded-[0.75rem] ${
        !notification?.notify && 'bg-blue-50/50'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="w-full">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-medium text-gray-900">
                  {notification?.title}
                </h3>
                {notification.projectId && (
                  <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-xs">
                    {notification?.project?.name}
                  </span>
                )}
              </div>

              {notification?.description && (
                <div className="flex items-center gap-2">
                  <p
                    className={`text-sm text-gray-600 ${
                      !isExpanded && 'w-[40rem] truncate'
                    }`}
                  >
                    {notification?.description}
                  </p>
                </div>
              )}
              <p className="text-xs text-gray-500">
                {formatTimestamp(notification?.createdAt)}
              </p>
            </div>
            {!notification?.notify && (
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {notification?.description && !isExpanded && (
            <Button
              variant="link"
              size="sm"
              onClick={() => toggleExpand()}
              className="text-blue-600 text-xs p-0 h-auto leading-none flex items-center gap-1"
            >
              View all
              <ChevronDown className="w-4 h-4" />
            </Button>
          )}
          {notification?.description && isExpanded && (
            <Button
              variant="link"
              size="sm"
              onClick={() => toggleExpand()}
              className="text-blue-600 text-xs p-0 h-auto leading-none flex items-center gap-1"
            >
              View less
              <ChevronUp className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItems;

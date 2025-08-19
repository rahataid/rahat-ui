"use client";


import { Button } from "@rahat-ui/shadcn/src/components/ui/button";


import { X, Bell } from "lucide-react";
import Link from "next/link";
import React from "react";
import { formatTimestamp } from "../utils/dateFormate";
import { Notification } from "@rahat-ui/types";


interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: Notification[];
  lengthOfNotification?: number;
  onMarkAsRead?: (id: string) => void;
  isLoading?: boolean;
}

export default  function NotificationPanel({
  isOpen,
  onClose,
  onMarkAsRead,
  notifications = [],
  lengthOfNotification= 0,
  isLoading = false,
  
}: NotificationPanelProps) {

const [expanded, setExpanded] = React.useState<{ [key: string]: boolean }>({});

const truncateDescription = (description?: string, maxLength = 20) => {
  if (!description) return "";
  return description.length > maxLength
    ? `${description.slice(0, maxLength)}...`
    : description;
};


  const displayedNotifications = notifications.slice(0, 4);

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!isOpen) return null;
 


  return (
    <>
    {/* Backdrop */}
    <div className="fixed inset-0 bg-black/20 z-[49]" onClick={onClose} />

<div className="fixed top-16 right-20 z-[50] flex items-start">
  <div className="bg-white rounded-lg shadow-xl w-[30rem] max-w-lg max-h-[80vh] flex flex-col">
    {/* Header */}
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Notifications</h2>
        {lengthOfNotification > 0 && (
          <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {lengthOfNotification}
          </span>
        )}
      </div>
      <button
        onClick={onClose}
        className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
      >
        <X className="h-4 w-4" />
      </button>
    </div>

   
    <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <p className="text-sm text-gray-500">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Bell className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  It's quiet now
                </h3>
                <p className="text-sm text-gray-500 max-w-xs">
                  Your notifications will appear here once there's something new to review
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {displayedNotifications.map((notification:Notification) => {
                  const isExpanded = expanded[notification.id] || false;
                  const truncatedDesc = truncateDescription(notification.description);

                  return (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.notify && "bg-blue-50/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col gap-1">
                            {/* <p className="text-sm font-medium text-gray-900 leading-5">
                              {notification.title}
                            </p> */}
                            <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-gray-900 leading-5">{notification.title}</p>
                          {notification.projectId && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-600">
                              {notification.projectId}
                            </span>
                          )}
                        </div>
                            {notification.description && (
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-gray-600">
                                  {isExpanded
                                    ? notification.description
                                    : truncatedDesc}
                                </p>
                                {!isExpanded && (
                                  <Button
                                    variant="link"
                                    className="text-blue-600 text-xs p-0 h-auto leading-none"
                                    onClick={() => toggleExpand(notification.id)}
                                  >
                                    View all
                                  </Button>
                                )}
                                {isExpanded && (
                                  <Button
                                    variant="link"
                                    className="text-blue-600 text-xs p-0 h-auto leading-none"
                                    onClick={() => toggleExpand(notification.id)}
                                  >
                                    View less
                                  </Button>
                                )}
                              </div>
                            )}
                            <p className="text-xs text-gray-500">
                              {formatTimestamp(notification.createdAt)}
                            </p>
                          </div>
                        </div>
                        {!notification.notify && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

    {/* Footer */}
    {notifications.length > 0 && (
      <div className="p-4 border-t">
        <div className="flex justify-end">
          <Link href="/notifications" onClick={onClose}>
            <Button
              variant="ghost"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              See all notifications →
            </Button>
          </Link>
        </div>
      </div>
    )}
  </div>
</div>
  </>

    
    
  );
}


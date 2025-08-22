"use client";

import { Button } from "@rahat-ui/shadcn/src/components/ui/button";
import { X, Bell, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import React from "react";
import { formatTimestamp } from "../utils/dateFormate";
import { Notification } from "@rahat-ui/types";
import { truncateDescription } from "../utils/truncateDescription";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: Notification[];
  lengthOfNotification?: number;
  onMarkAsRead?: (id: string) => void;
  isLoading?: boolean;
}

export default function NotificationPanel({
  isOpen,
  onClose,
  onMarkAsRead,
  notifications = [],
  lengthOfNotification = 0,
  isLoading = false,
}: NotificationPanelProps) {
  const [expanded, setExpanded] = React.useState<{ [key: string]: boolean }>({});


 const displayedNotifications = notifications.slice(0, 4);
 

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-[64px] right-8 z-[100]">
      <div className="bg-white rounded-[16px] border border-gray-200 w-[90vw] min-w-[300px] max-w-[480px] min-h-[200px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-2">
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
            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 rounded-full flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Notification List */}
        <div className="pt-2 pr-4 pb-2 pl-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[200px]">
              <p className="text-sm text-gray-500">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[200px]">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 relative">
                <Bell className="h-6 w-6 text-gray-400" />
                <span className="absolute w-10 h-0.5 bg-gray-400 transform rotate-45 origin-center"></span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                It's quiet now
              </h3>
              <p className="text-sm text-gray-500 max-w-xs text-center">
                Your notifications will appear here once there's something new to review
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {displayedNotifications.map((notification: Notification) => (
                <div
                  key={notification.id}
                  className="rounded-[12px] p-3 bg-[#EAF2FB] flex items-start gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      {notification.projectId && (
                        <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-700 text-xs whitespace-nowrap">
                          {notification.project.name}
                        </span>
                      )}
                    </div>
                    
                    {notification.description && (
                      <div className="mb-1 flex items-start justify-between">
                        <p className="text-sm text-gray-600">
                          {expanded[notification.id]
                            ? notification.description
                            : truncateDescription(notification.description, 50)}
                        </p>
                        <button
                          onClick={() => toggleExpand(notification.id)}
                          className="text-blue-600 text-xs ml-2 flex items-center gap-1 flex-shrink-0"
                        >
                          {expanded[notification.id] ? (
                            <>
                              <ChevronUp className="h-3 w-3" />
                              View Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3 w-3" />
                              View All
                            </>
                          )}
                        </button>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500">
                      {formatTimestamp(notification.createdAt)}
                    </p>
                  </div>
                  
                  {!notification.notify && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-1">
            <div className="flex justify-end">
              <Link href="/notifications" onClick={onClose}>
                <Button
                  variant="ghost"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm"
                >
                  See all notifications →
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
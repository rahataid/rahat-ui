"use client";

import { Button } from "@rahat-ui/shadcn/src/components/ui/button";
import { X, Bell } from "lucide-react";
import Link from "next/link";
import React from "react";

interface Notification {
  id: string;
  title: string;
  timestamp: string;
  isRead: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
}

export default  function NotificationPanel({
  isOpen,
  onClose,
  onMarkAsRead,
}: NotificationPanelProps) {
  const notifications = [
    {
      id: "1",
      title: "This is a demo for notification title",
      timestamp: "4h ago",
      isRead: false,
    },
    {
      id: "2",
      title: "Something has happened",
      timestamp: "4h ago",
      isRead: false,
    },
    {
      id: "3",
      title: "Activation has been activated",
      timestamp: "4h ago",
      isRead: true,
    },
    {
      id: "4",
      title: "This is a demo for notification title back or the organization and there is another !",
      timestamp: "4h ago",
      isRead: true,
    },
    {
      id: "5",
      title: "This is a demo for notification title back!",
      timestamp: "4h ago",
      isRead: true,
    },
    {
      id: "6",
      title: "This is a sixth demo for notification title back!",
      timestamp: "4h ago",
      isRead: true,
    }
  ];
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const displayedNotifications = notifications.slice(0, 4);
  // Function to truncate title to half its length
  const truncateTitle = (title: string, maxLength: number) => {
    const halfLength = Math.floor(maxLength / 2);
    return title.length > maxLength ? `${title.slice(0, halfLength)}…` : title;
  };

  if (!isOpen) return null;
  // State to track which notifications are expanded
  const [expanded, setExpanded] = React.useState<{ [key: string]: boolean }>({});

  // Toggle expansion for a specific notification
  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
{/* Backdrop */}
<div
        className="fixed inset-0 bg-black/20 z-[49]"
        onClick={onClose}
      />
  
      <div className="fixed top-16 right-20 z-[50] flex items-start ">
        <div className="bg-white rounded-lg shadow-xl w-[30rem] max-w-lg max-h-[80vh] flex flex-col">
     
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Notifications</h2>
              {unreadCount > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
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
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Bell className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  It's quiet now
                </h3>
                <p className="text-sm text-gray-500 max-w-xs">
                  Your notifications will appear here once there's something new
                  to review
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {displayedNotifications.map((notification) => {
                  const maxTitleLength = 30; // Adjust this value based on your design
                  const truncatedTitle = truncateTitle(notification.title, maxTitleLength);
                  const isTruncated = notification.title.length > maxTitleLength;
                  const isExpanded = expanded[notification.id] || false;

                  return (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.isRead && 'bg-blue-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-medium text-gray-900 leading-5">
                              {isExpanded ? notification.title : truncatedTitle}
                            </p>
                            {isTruncated && !isExpanded && (
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
                                Collapse
                              </Button>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.timestamp}
                            </p>
                          </div>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-4 border-t">
              <div className="flex justify-end">
                <Link href="/notifications" onClick={onClose}>
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
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


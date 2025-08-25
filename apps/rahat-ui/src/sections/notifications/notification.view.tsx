
"use client";

import { Button } from "@rahat-ui/shadcn/src/components/ui/button";
import { X, Bell, ChevronDown, ChevronUp } from "lucide-react";
import React, { useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useGetAllNotificatons } from "@rahat-ui/query";
import { formatTimestamp } from "../../utils/dateFormate";
import { Notification } from "@rahat-ui/types";
import { truncateDescription } from "../../utils/truncateDescription";

export default function NotificationsView() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    totalNotifications,
  } = useGetAllNotificatons();

  const notifications = data?.pages.flatMap((page) => page.data || []) || [];


  const router = useRouter();
  const [expanded, setExpanded] = React.useState<{ [key: string]: boolean }>({});
  const loaderRef = useRef<HTMLDivElement>(null);

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleClose = () => {
    router.back();
  };

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      console.log("Observer triggered:", target.isIntersecting, "hasNextPage:", hasNextPage, "isFetchingNextPage:", isFetchingNextPage);
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 0.1,
    });
    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }
    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
      observer.disconnect();
    };
  }, [handleObserver]);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center overflow-x-hidden">
      <div className="flex flex-col">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute top-6 right-8 text-gray-400 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="bg-white rounded-[1rem] shadow-sm w-[90vw] min-w-[300px] max-w-[50.75rem] min-h-[200px] p-2 flex flex-col gap-1">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-gray-900">Notifications</h1>
                {totalNotifications > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalNotifications}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">Here is the list of all your notifications</p>
              {totalNotifications > 0 && (
                <p className="text-sm text-gray-500">{totalNotifications} Notifications</p>
              )}
            </div>

            <div className="flex-1" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[200px]">
                  <p className="text-sm text-gray-500">Loading notifications...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center min-h-[200px] gap-2">
                  <p className="text-sm text-red-500">Failed to load notifications. Please try again.</p>
                  <Button
                    onClick={() => fetchNextPage()}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    Retry
                  </Button>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[200px]">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 relative">
                    <Bell className="h-6 w-6 text-gray-400" />
                    <span className="absolute w-10 h-0.5 bg-gray-400 transform rotate-45 origin-center"></span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">It's quiet now</h3>
                  <p className="text-sm text-gray-500 max-w-xs text-center">
                    Your notifications will appear here once there's something new to review
                  </p>
                </div>
              ) : (
                <div className="space-y-[0.875rem]">
                  {notifications.map((notification: Notification) => {
                    const isExpanded = expanded[notification.id] || false;
                    const truncatedDesc = truncateDescription(notification.description, 60);

                    return (
                      <div
                        key={notification.id}
                        className={`p-4 bg-[#EAF2FB] hover:bg-[#EAF2FB] cursor-pointer transition-colors rounded-[0.75rem] ${
                          !notification.notify && "bg-blue-50/50"
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
                                <ChevronDown className="w-4 h-4" />
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
                                <ChevronUp className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {hasNextPage && (
                    <div ref={loaderRef} className="h-10 flex items-center justify-center">
                      <p className="text-sm text-gray-500">Loading more...</p>
                    </div>
                  )}
                </div>
              )}
              &nbsp; 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

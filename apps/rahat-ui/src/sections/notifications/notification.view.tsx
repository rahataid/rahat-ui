'use client';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { X, Bell } from 'lucide-react';
import React, { useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useGetAllNotificatons } from '@rahat-ui/query';
import { Notification } from '@rahat-ui/types';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import NotificationItems from './notificationItems';

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

  const loaderRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    router.back();
  };

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
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
    <div className="bg-gray-50 flex justify-center items-center h-[calc(100vh-60px)]">
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

          <div className="bg-white rounded-[1rem] shadow-sm w-[90vw] min-w-[300px] max-w-[50.75rem] min-h-[200px] p-4 flex flex-col gap-1">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-gray-900">
                  Notifications
                </h1>
                {totalNotifications > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalNotifications}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Here is the list of all your notifications
              </p>
              {totalNotifications > 0 && (
                <p className="text-sm text-gray-500">
                  {totalNotifications} Notifications
                </p>
              )}
            </div>

            <div
              className="flex-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[200px]">
                  <p className="text-sm text-gray-500">
                    Loading notifications...
                  </p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center min-h-[200px] gap-2">
                  <p className="text-sm text-red-500">
                    Failed to load notifications. Please try again.
                  </p>
                  <Button
                    onClick={() => fetchNextPage()}
                    className="text-white hover:text-blue-700 hover:bg-blue-200"
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    It&#39;s quiet now
                  </h3>
                  <p className="text-sm text-gray-500 max-w-xs text-center">
                    Your notifications will appear here once there&#39;s
                    something new to review
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="space-y-[0.875rem]">
                    {notifications.map((notification: Notification) => {
                      return (
                        <NotificationItems
                          key={notification.id}
                          notification={notification}
                        />
                      );
                    })}
                    {hasNextPage && (
                      <div
                        ref={loaderRef}
                        className="h-10 flex items-center justify-center"
                      >
                        <p className="text-sm text-gray-500">Loading more...</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              )}
              &nbsp;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

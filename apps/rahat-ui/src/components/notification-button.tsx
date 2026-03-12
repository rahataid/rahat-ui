'use client';

import { Bell } from 'lucide-react';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import React from 'react';
import dynamic from 'next/dynamic';
import { useGetAllNotificatons } from '@rahat-ui/query';

const NotificationPanel = dynamic(() => import('./notification.panal'), {
  ssr: false,
});

export function NotificationButton({ unreadCount = 0 }) {
  const { data, totalNotifications, isLoading } = useGetAllNotificatons();

  const notifications = data?.pages.flatMap((page) => page.data || []) || [];

  const notificationModal = useBoolean();

  const handleNotification = () => {
    notificationModal.onToggle();
  };

  return (
    <>
      <button
        onClick={handleNotification}
        className="relative p-2 compact:p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="h-6 w-6 compact:h-4 compact:w-4" />
        {totalNotifications > 0 && (
          <span className="absolute -top-1 -right-1 compact:-top-0.5 compact:-right-0.5 bg-blue-500 text-white text-xs compact:text-[10px] rounded-full h-5 w-5 compact:h-4 compact:w-4 flex items-center justify-center font-medium">
            {totalNotifications}
          </span>
        )}
      </button>
      <NotificationPanel
        isOpen={notificationModal.value}
        onClose={notificationModal.onFalse}
        notifications={notifications || []}
        lengthOfNotification={totalNotifications || 0}
        isLoading={isLoading}
      />
    </>
  );
}

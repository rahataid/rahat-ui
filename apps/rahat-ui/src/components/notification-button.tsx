'use client';

import { Bell } from 'lucide-react';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import React from 'react';
import dynamic from 'next/dynamic';
import { useGetAllNotificatons } from '@rahat-ui/query';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';

const NotificationPanel = dynamic(() => import('./notification.panal'), {
  ssr: false,
});

export function NotificationButton({ unreadCount = 0 }) {
  const { data, totalNotifications, isLoading } = useGetAllNotificatons();
  const formatNum = useNumberFormat();

  const notifications = data?.pages.flatMap((page) => page.data || []) || [];

  const notificationModal = useBoolean();

  const handleNotification = () => {
    notificationModal.onToggle();
  };

  return (
    <>
      <button
        onClick={handleNotification}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="h-6 w-6" />
        {totalNotifications > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {formatNum(totalNotifications)}
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

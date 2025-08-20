'use client';
import { useEffect } from 'react';
import {
 
  useQuery,

} from '@tanstack/react-query';
import { useGeneralAction } from '../../projects';

import { useNotificationStore } from './notification.store';

export const useGetAllNotificatons = () => {
  const q = useGeneralAction()
  const { setNotifications } = useNotificationStore((state) => ({
    setNotifications: state.setNotifications,
  }));
 

  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        data: {
          action: 'notification.list',
          payload: {},
        },
    
      });
      return mutate
    },
  });

  useEffect(() => {
    if (query.data) {
     setNotifications(query?.data.data);
    }
  }, [query.data]);
  return query;
};










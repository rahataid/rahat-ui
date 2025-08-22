'use client';
import { useEffect } from 'react';
import {
 
  useInfiniteQuery,
  useQuery,

} from '@tanstack/react-query';
//import { useGeneralAction } from '../../projects';

import { useNotificationStore } from './notification.store';

import { api } from '../../utils/api';

import { TAGS } from '../../config';


const listNotifications = async (payload:any) => {
  const response = await api.get('/notifications', {
    params: payload,
  });
  return response?.data;
};





export const useGetAllNotificatons = () => {
  const { setNotifications } = useNotificationStore((state) => ({
    setNotifications: state.setNotifications,
  }));

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: [TAGS.ALL_NOTIFICATIONS],
    queryFn: ({ pageParam = 1 }) =>
      listNotifications({
     
        page: pageParam,
        perPage:10
      }),
    getNextPageParam: (lastPage) => {
      const { meta , data } = lastPage;
   
      return meta.currentPage < meta.total ? meta.next : undefined;
    },
    initialPageParam: 1,
   
  });

  useEffect(() => {
    if (data) {
      const allNotifications = data.pages.flatMap((page) => page.data || []);
      setNotifications(allNotifications);
    }
  }, [data, setNotifications]);

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    totalNotifications: data?.pages[0]?.meta?.total || 0,
  };
};










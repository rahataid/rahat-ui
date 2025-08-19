'use client';
import { useEffect } from 'react';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useGeneralAction, useProjectAction, useProjectSettingsStore } from '../../projects';

import { UUID } from 'crypto';
import { useSwal } from 'libs/query/src/swal';
import { PROJECT_SETTINGS_KEYS } from 'libs/query/src/config';

export const useGetAllNotificatons = () => {
  const q = useGeneralAction()
  // const { setCategories } = useActivitiesStore((state) => ({
  //   setCategories: state.setCategories,
  // }));

  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        data: {
          action: 'notification.list',
          payload: {},
        },
      });
      return mutate.data;
    },
  });

  // useEffect(() => {
  //   if (query.data) {
  //     setCategories(query?.data);
  //   }
  // }, [query.data]);
  return query;
};










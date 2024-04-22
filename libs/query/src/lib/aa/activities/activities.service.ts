import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useProjectAction } from '../../projects';
import { useActivitiesStore } from './activities.store';
import { UUID } from 'crypto';
import { useSwal } from 'libs/query/src/swal';

export const useActivitiesCategories = (uuid: UUID) => {
  const q = useProjectAction();
  const { setCategories } = useActivitiesStore((state) => ({
    setCategories: state.setCategories,
  }));

  const query = useQuery({
    queryKey: ['categories', uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aaProject.activityCategories.getAll',
          payload: {},
        },
      });
      return mutate.data;
    },
  });

  useEffect(() => {
    if (query.data) {
      setCategories(query?.data);
    }
  }, [query.data]);
  return query;
};

export const useActivitiesPhase = (uuid: UUID) => {
  const q = useProjectAction();
  const { setPhase } = useActivitiesStore((state) => ({
    setPhase: state.setPhases,
  }));

  const query = useQuery({
    queryKey: ['phases', uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aaProject.phases.getAll',
          payload: {},
        },
      });
      return mutate.data;
    },
  });
  useEffect(() => {
    if (query.data) {
      setPhase(query?.data);
    }
  }, [query.data]);
  return query;
};

export const useActivitiesHazardTypes = (uuid: UUID) => {
  const q = useProjectAction();
  const { setHazardTypes } = useActivitiesStore((state) => ({
    setHazardTypes: state.setHazardTypes,
  }));

  const query = useQuery({
    queryKey: ['hazardTypes', uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aaProject.hazardTypes.getAll',
          payload: {},
        },
      });
      return mutate.data;
    },
  });
  useEffect(() => {
    if (query.data) {
      setHazardTypes(query?.data);
    }
  }, [query.data]);
  return query;
};

export const useActivities = (uuid: UUID) => {
  const q = useProjectAction();
  const { setActivities } = useActivitiesStore((state) => ({
    setActivities: state.setActivities,
  }));
  const query = useQuery({
    queryKey: ['activities', uuid],
    select: (data) => {
      return {
        ...data,
        data: data.map((d: any) => ({
          id: d.uuid,
          title: d.title,
          responsibility: d.responsibility,
          source: d.source,
          hazardType: d.hazardType?.name,
          category: d.category?.name,
          description: d.description,
        })),
      };
    },
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aaProject.activities.getAll',
          payload: {},
        },
      });
      return mutate.data;
    },
  });
  useEffect(() => {
    if (query.data) {
      setActivities(query?.data);
    }
  }, [query.data]);
  return query;
};

export const useCreateActivities = () => {
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({
      projectUUID,
      activityPayload,
    }: {
      projectUUID: UUID;
      activityPayload: any;
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aaProject.activities.add',
          payload: activityPayload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      toast.fire({
        title: 'Activity added successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while adding activity.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useDeleteActivities = () => {
  const qc = useQueryClient();
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({
      projectUUID,
      activityPayload,
    }: {
      projectUUID: UUID;
      activityPayload: {
        uuid: string;
      };
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aaProject.activities.remove',
          payload: activityPayload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({ queryKey: ['activities'] });
      toast.fire({
        title: 'Activity removed successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while removing activity.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

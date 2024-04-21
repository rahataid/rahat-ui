import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useProjectAction } from '../../projects';
import { useActivitiesFieldStore } from './activities.field.store';
import { UUID } from 'crypto';

export const useActivitiesCategories = (uuid: UUID) => {
  const q = useProjectAction();
  const { setCategories } = useActivitiesFieldStore((state) => ({
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
  const { setPhase } = useActivitiesFieldStore((state) => ({
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
  const { setHazardTypes } = useActivitiesFieldStore((state) => ({
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
  const { setDemoActivities } = useActivitiesFieldStore((state) => ({
    setDemoActivities: state.setDemoActivities,
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
      setDemoActivities(query?.data);
    }
  }, [query.data]);
  return query;
};

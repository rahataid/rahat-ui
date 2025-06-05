'use client';
import { UUID } from 'crypto';
import { useProjectAction, useProjectSettingsStore } from '../../projects';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSwal } from 'libs/query/src/swal';
import { usePhasesStore } from './phases.store';
import React, { useEffect } from 'react';
import { PROJECT_SETTINGS_KEYS } from 'libs/query/src/config';

export const useSinglePhase = (uuid: UUID, phaseId: UUID) => {
  const q = useProjectAction();
  const { setThreshhold } = usePhasesStore((state) => ({
    setThreshhold: state.setThreshold,
  }));

  const query = useQuery({
    queryKey: ['phase', uuid, phaseId],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.phases.getOne',
          payload: {
            uuid: phaseId,
          },
        },
      });
      return mutate.data;
    },
  });
  useEffect(() => {
    setThreshhold({
      name: query?.data?.name,
      mandatory: query?.data?.requiredMandatoryTriggers,
      optional: query?.data?.requiredOptionalTriggers,
    });
  }, [query?.data]);

  return query;
};

export const useRevertPhase = () => {
  const q = useProjectAction();
  const qc = useQueryClient();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
  });
  return useMutation({
    mutationFn: async ({
      projectUUID,
      payload,
    }: {
      projectUUID: UUID;
      payload: {
        phaseUuid: UUID;
      };
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'ms.revertPhase.create',
          payload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({ queryKey: ['phase'] });
      qc.invalidateQueries({ queryKey: ['phases'] });
      qc.invalidateQueries({ queryKey: ['triggerstatements'] });
      qc.invalidateQueries({ queryKey: ['phaseHistory'] });
      toast.fire({
        title: 'Phase reverted successfully.',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while reverting phase.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const usePhaseHistory = (uuid: UUID, payload: { phaseUuid: UUID }) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['phaseHistory', uuid, payload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.revertPhase.getAll',
          payload: payload,
        },
      });
      return mutate.data;
    },
  });
  return query;
};

export const usePhases = (uuid: UUID) => {
  const q = useProjectAction();
  const { setPhase } = usePhasesStore((state) => ({
    setPhase: state.setPhases,
  }));
  const { settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
  }));
  const query = useQuery({
    queryKey: ['phases', uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.phases.getAll',
          payload: {
            activeYear:
              settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.[
                'active_year'
              ],
            riverBasin:
              settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.[
                'river_basin'
              ],
          },
        },
      });
      return mutate.data;
    },
  });
  React.useEffect(() => {
    if (query.data) {
      setPhase(query?.data);
    }
  }, [query.data]);
  return query;
};

export const useConfigureThreshold = () => {
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
  });
  return useMutation({
    mutationFn: async ({
      projectUUID,
      payload,
    }: {
      projectUUID: UUID;
      payload: {
        uuid: string;
        requiredMandatoryTriggers: number;
        requiredOptionalTriggers: number;
      };
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'ms.phase.configureThreshold',
          payload,
        },
      });
    },
    onSuccess: () => {
      q.reset();

      toast.fire({
        title: 'Threshold configure successfully.',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while configuring  threshold.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

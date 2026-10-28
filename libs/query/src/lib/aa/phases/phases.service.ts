'use client';
import { UUID } from 'crypto';
import { useProjectAction, useProjectSettingsStore } from '../../projects';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usePhasesStore } from './phases.store';
import React, { useEffect } from 'react';
import { PROJECT_SETTINGS_KEYS } from 'libs/query/src/config';
import { PHASE_QUERY_KEYS } from '../trigger-statements/trigger-statements.constants';
import { useTranslations } from 'next-intl';
import { resolveBackendErrorMessage } from '../../../utils/i18n/backend-error';
import { toast } from 'react-toastify';
import { showToast } from 'libs/query/src/utils/custom-toast';

export const useSinglePhase = (
  uuid: UUID,
  phaseId: UUID,
  options?: { enabled?: boolean },
) => {
  const t = useTranslations('AA_PROJECT');
  const q = useProjectAction();
  const { setThreshhold } = usePhasesStore((state) => ({
    setThreshhold: state.setThreshold,
  }));

  const query = useQuery({
    queryKey: [PHASE_QUERY_KEYS.PHASE, uuid, phaseId],
    enabled: options?.enabled !== false,
    queryFn: async () => {
      try {
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
      } catch (error: any) {
        showToast({
          type: 'error',
          title: t('ERROR_WHILE_FETCHING_PHASE_DETAILS'),
          description: error.message,
        });
      }
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
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const qc = useQueryClient();

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
      qc.invalidateQueries({ queryKey: [PHASE_QUERY_KEYS.PHASE] });
      qc.invalidateQueries({ queryKey: [PHASE_QUERY_KEYS.PHASES] });
      qc.invalidateQueries({ queryKey: [PHASE_QUERY_KEYS.TRIGGER_STATEMENT] });
      qc.invalidateQueries({ queryKey: [PHASE_QUERY_KEYS.PHASE_HISTORY] });
      toast.success(t('PHASE_REVERTED_SUCCESSFULLY'));
    },
    onError: (error: any) => {
      const rawMessage = error?.response?.data?.message || t('ERROR');
      const errorMessage = resolveBackendErrorMessage(
        tb,
        error?.response?.data?.code,
        error?.response?.data?.params,
        ['TRIGGER_STATEMENTS_PHASES'],
        rawMessage,
      );
      q.reset();
      showToast({
        type: 'error',
        title: t('ERROR_WHILE_REVERTING_PHASE'),
        description: errorMessage,
      });
    },
  });
};

export const usePhaseHistory = (
  uuid: UUID,
  payload: { phaseUuid: UUID; phase: boolean },
) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: [PHASE_QUERY_KEYS.PHASE_HISTORY, uuid, payload],
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

  const activeYear =
    settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.['active_year'];

  const riverBasin =
    settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.['river_basin'];

  const query = useQuery({
    queryKey: [PHASE_QUERY_KEYS.PHASES, uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.phases.getAll',
          payload: {
            activeYear,
            riverBasin,
          },
        },
      });
      return mutate.data;
    },
    enabled: !!(uuid && activeYear && riverBasin),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
  React.useEffect(() => {
    if (query.data) {
      setPhase(query?.data);
    }
  }, [query.data]);
  return query;
};

export const useConfigureThreshold = () => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();

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

      toast.success(t('THRESHOLD_CONFIGURE_SUCCESSFULLY'));
    },
    onError: (error: any) => {
      const rawMessage = error?.response?.data?.message || t('ERROR');
      const errorMessage = resolveBackendErrorMessage(
        tb,
        error?.response?.data?.code,
        error?.response?.data?.params,
        ['TRIGGER_STATEMENTS_PHASES'],
        rawMessage,
      );
      q.reset();
      showToast({
        type: 'error',
        title: t('ERROR_WHILE_CONFIGURING_THRESHOLD'),
        description: errorMessage,
      });
    },
  });
};

export const useSources = (uuid: UUID, payload: any) => {
  const q = useProjectAction();
  const query = useQuery({
    queryKey: ['sources', uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.sources.getAll',
          payload,
        },
      });
      return mutate.data;
    },
    enabled: !!uuid,
  });
  return query;
};

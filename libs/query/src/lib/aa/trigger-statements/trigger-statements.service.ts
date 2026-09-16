'use client';
import { UUID } from 'crypto';
import { useAAStationsStore } from './trigger-statements.store';
import { useProjectAction } from '../../projects/projects.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useSwal } from '../../../swal';
import { useProjectSettingsStore } from '../../projects';
import { MS_TRIGGERS_KEYS, PROJECT_SETTINGS_KEYS } from 'libs/query/src/config';
import { useSettingsStore } from '../../settings';
import {
  FORECAST_QUERY_KEYS,
  PHASE_QUERY_KEYS,
} from './trigger-statements.constants';
import { useTranslations } from 'next-intl';
import { resolveBackendErrorMessage } from '../../../utils/i18n/backend-error';

export const useCreateTriggerStatement = () => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const qc = useQueryClient();

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
      triggerStatementPayload,
    }: {
      projectUUID: UUID;
      triggerStatementPayload: any;
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'ms.triggers.add',
          payload: triggerStatementPayload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({ queryKey: [PHASE_QUERY_KEYS.PHASES] });
      qc.invalidateQueries({ queryKey: [PHASE_QUERY_KEYS.TRIGGER_STATEMENT] });
      toast.fire({
        title: t('TRIGGER_STATEMENT_ADDED_SUCCESSFULLY'),
        icon: 'success',
      });
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
      toast.fire({
        title: t('ERROR_2'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useCreatePhase = () => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const qc = useQueryClient();
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
      phasePayload,
    }: {
      projectUUID: UUID;
      phasePayload: any;
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'ms.phases.create',
          payload: phasePayload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({ queryKey: [PHASE_QUERY_KEYS.PHASES] });
      qc.invalidateQueries({ queryKey: [PHASE_QUERY_KEYS.TRIGGER_STATEMENT] });
      toast.fire({
        title: t('PHASE_ADDED_SUCCESSFULLY'),
        icon: 'success',
      });
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
      toast.fire({
        title: t('ERROR_WHILE_ADDING_PHASE'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useUpdatePhase = () => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const qc = useQueryClient();
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
      phasePayload,
    }: {
      projectUUID: UUID;
      phasePayload: any;
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'ms.phases.update',
          payload: phasePayload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({ queryKey: [PHASE_QUERY_KEYS.PHASE] });
      qc.invalidateQueries({ queryKey: [PHASE_QUERY_KEYS.PHASES] });
      qc.invalidateQueries({ queryKey: [PHASE_QUERY_KEYS.TRIGGER_STATEMENT] });
      toast.fire({
        title: t('PHASE_UPDATED_SUCCESSFULLY'),
        icon: 'success',
      });
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
      toast.fire({
        title: t('ERROR_WHILE_UPDATING_PHASE'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useConfigureExtendedLogic = () => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const qc = useQueryClient();
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
      payload,
    }: {
      projectUUID: UUID;
      payload: {
        uuid: string;
        groups: {
          operator: 'AND' | 'OR';
          triggers: { triggerLogicKey: string }[];
        }[];
        joinOperator: 'AND' | 'OR';
      };
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'ms.phases.configureExtendedLogic',
          payload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({ queryKey: [PHASE_QUERY_KEYS.PHASE] });
      qc.invalidateQueries({ queryKey: [PHASE_QUERY_KEYS.PHASES] });
      qc.invalidateQueries({ queryKey: [PHASE_QUERY_KEYS.TRIGGER_STATEMENT] });
      toast.fire({
        title: t('EXTENDED_TRIGGER_LOGIC_CONFIGURED_SUCCESSFULLY'),
        icon: 'success',
      });
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
      toast.fire({
        title: t('ERROR_WHILE_CONFIGURING_EXTENDED_TRIGGER_LOGIC'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useDeletePhase = () => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const qc = useQueryClient();
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
      phasePayload,
    }: {
      projectUUID: UUID;
      phasePayload: {
        uuid: UUID;
      };
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'ms.phases.delete',
          payload: phasePayload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({ queryKey: [PHASE_QUERY_KEYS.PHASE] });
      qc.invalidateQueries({ queryKey: [PHASE_QUERY_KEYS.PHASES] });
      qc.invalidateQueries({ queryKey: [PHASE_QUERY_KEYS.TRIGGER_STATEMENT] });
      toast.fire({
        title: t('PHASE_DELETED_SUCCESSFULLY'),
        icon: 'success',
      });
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
      toast.fire({
        title: t('ERROR_WHILE_DELETING_PHASE'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useAddTriggerStatementToPhase = () => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const qc = useQueryClient();
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
      addToPhasePayload,
    }: {
      projectUUID: UUID;
      addToPhasePayload: any;
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aaProject.phases.addTriggers',
          payload: addToPhasePayload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({ queryKey: [PHASE_QUERY_KEYS.PHASES] });
      qc.invalidateQueries({ queryKey: [PHASE_QUERY_KEYS.TRIGGER_STATEMENT] });
      toast.fire({
        title: t('TRIGGER_STATEMENT_ADDED_SUCCESSFULLY'),
        icon: 'success',
      });
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
      toast.fire({
        title: t('ERROR_2'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useDeleteTriggerStatement = () => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
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
      triggerStatementPayload,
    }: {
      projectUUID: UUID;
      triggerStatementPayload: {
        uuid: string;
      };
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'ms.triggers.remove',
          payload: triggerStatementPayload,
        },
      });
    },

    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({ queryKey: [PHASE_QUERY_KEYS.PHASES] });
      qc.invalidateQueries({ queryKey: [PHASE_QUERY_KEYS.TRIGGER_STATEMENT] });
      toast.fire({
        title: t('TRIGGER_STATEMENT_REMOVED_SUCCESSFULLY'),
        icon: 'success',
      });
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
      toast.fire({
        title: t('ERROR_WHILE_REMOVING_TRIGGER_STATEMENT'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useAAStations = (uuid: UUID) => {
  const q = useProjectAction();
  const { setDhmStations } = useAAStationsStore((state) => ({
    dhmStations: state.dhmStations,
    setDhmStations: state.setDhmStations,
  }));

  const query = useQuery({
    queryKey: ['dhm', uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aaProject.riverStations.getDhm',
          payload: {},
        },
      });
      return mutate.data;
    },
  });

  useEffect(() => {
    if (query.data) {
      setDhmStations({
        [uuid]: query?.data,
      });
    }
  }, [query.data]);
  return query;
};

export const useDhmWaterLevels = (
  uuid: UUID,
  payload: any,
  activeTab?: string,
) => {
  const q = useProjectAction();
  const { from, to } = payload;

  const query = useQuery({
    queryKey: [FORECAST_QUERY_KEYS.DHM_WATER_LEVELS, uuid, activeTab, from, to],
    staleTime: 15 * 60 * 1000, // 15 minutes
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.waterLevels.getDhm',
          payload: payload,
        },
      });
      return mutate.data;
    },
  });

  return query;
};

export const useDhmSingleSeriesWaterLevels = (
  uuid: UUID,
  activeTab: string,
  payload: {
    date: string;
    seriesId: number;
  },
) => {
  const q = useProjectAction();

  const { date, ...rest } = payload;

  const settings = useProjectSettingsStore((state) => state.settings);

  const riverBasin =
    settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.['river_basin'];

  const query = useQuery({
    queryKey: [
      FORECAST_QUERY_KEYS.DHM_SINGLE_SERIES_WATER_LEVELS,
      uuid,
      activeTab,
      payload,
    ],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.waterLevels.getDhmSingleSeries',
          payload: {
            ...rest,
            from: date,
            to: date,
            riverBasin,
            period: activeTab?.toUpperCase(),
          },
        },
      });
      return mutate.data;
    },
  });

  return query;
};

export const useDhmRainfallLevels = (uuid: UUID, payload: any) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: [FORECAST_QUERY_KEYS.DHM_RAINFALL_LEVELS, uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.rainfallLevels.getDhm',
          payload: payload,
        },
      });
      return mutate.data;
    },
    staleTime: 15 * 60 * 1000,
  });

  return query;
};

export const useSyncForecastData = (uuid: UUID) => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const qc = useQueryClient();

  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({ projectUUID }: { projectUUID: UUID }) => {
      return Promise.race([
        q.mutateAsync({
          uuid: projectUUID,
          data: {
            action: 'ms.sources-data.syncForecastData',
            payload: {},
          },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => {
            const timeoutError = new Error(
              'The sync is taking longer than expected. Please check again in a few moments.',
            );
            timeoutError.name = 'ForecastSyncTimeoutError';
            reject(timeoutError);
          }, 60000),
        ),
      ]);
    },
    onSuccess: () => {
      q.reset();
      Object.values(FORECAST_QUERY_KEYS).forEach((key) => {
        qc.invalidateQueries({
          queryKey: [key, uuid],
        });
      });
      toast.fire({
        title: t('FORECAST_DATA_SYNCED_SUCCESSFULLY'),
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const rawMessage = error?.response?.data?.message || t('ERROR');
      const errorMessage =
        error?.name === 'ForecastSyncTimeoutError'
          ? t('FORECAST_SYNC_TIMEOUT')
          : resolveBackendErrorMessage(
              tb,
              error?.response?.data?.code,
              error?.response?.data?.params,
              ['TRIGGER_STATEMENTS_PHASES'],
              rawMessage,
            );
      q.reset();
      toast.fire({
        title: t('ERROR_WHILE_SYNCING_FORECAST_DATA'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useDhmTemperatureLevels = (uuid: UUID, payload: any) => {
  const t = useTranslations('AA_PROJECT');
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });

  return useQuery({
    queryKey: [
      FORECAST_QUERY_KEYS.DHM_TEMPERATURE_LEVELS,
      uuid,
      payload.riverBasin,
      payload.from,
    ],
    enabled: !!payload.riverBasin,
    queryFn: async () => {
      try {
        const mutate = await q.mutateAsync({
          uuid,
          data: {
            action: 'ms.temperature.getDhm',
            payload: payload,
          },
        });
        return mutate.data;
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          t('FAILED_TO_FETCH_TEMPERATURE_DATA');
        toast.fire({
          title: t('ERROR_LOADING_TEMPERATURE_DATA'),
          text: errorMessage,
          icon: 'error',
        });
        throw error;
      }
    },
    staleTime: 15 * 60 * 1000,
  });
};

export const useDhmHumidityLevels = (uuid: UUID, payload: any) => {
  const t = useTranslations('AA_PROJECT');
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });

  return useQuery({
    queryKey: [
      FORECAST_QUERY_KEYS.DHM_HUMIDITY_LEVELS,
      uuid,
      payload.riverBasin,
      payload.from,
    ],
    enabled: !!payload.riverBasin,
    queryFn: async () => {
      try {
        const mutate = await q.mutateAsync({
          uuid,
          data: {
            action: 'ms.humidity.getDhm',
            payload: payload,
          },
        });
        return mutate.data;
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          t('FAILED_TO_FETCH_HUMIDITY_DATA');
        toast.fire({
          title: t('ERROR_LOADING_HUMIDITY_DATA'),
          text: errorMessage,
          icon: 'error',
        });
        throw error;
      }
    },
    staleTime: 15 * 60 * 1000,
  });
};

export const useDhmSingleSeriesTemperatureLevels = (
  uuid: UUID,
  payload: {
    type?: 'daily' | 'hourly';
  },
) => {
  const q = useProjectAction();

  const settings = useProjectSettingsStore((state) => state.settings);
  const riverBasin =
    settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.['river_basin'];

  const parameter = payload.type === 'daily' ? 'TX_1D' : 'T_1H';

  return useQuery({
    queryKey: [
      FORECAST_QUERY_KEYS.DHM_SINGLE_SERIES_TEMPERATURE_LEVELS,
      uuid,
      parameter,
    ],
    enabled: !!riverBasin,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.temperature.getDhmSingleSeries',
          payload: {
            riverBasin,
            parameter,
          },
        },
      });
      return mutate.data;
    },
    staleTime: 15 * 60 * 1000,
  });
};

export const useDhmSingleSeriesHumidityLevels = (uuid: UUID) => {
  const q = useProjectAction();

  const settings = useProjectSettingsStore((state) => state.settings);
  const riverBasin =
    settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.['river_basin'];

  const parameter = 'RH_1H';

  return useQuery({
    queryKey: [
      FORECAST_QUERY_KEYS.DHM_SINGLE_SERIES_HUMIDITY_LEVELS,
      uuid,
      parameter,
    ],
    enabled: !!riverBasin,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.humidity.getDhmSingleSeries',
          payload: {
            riverBasin,
            parameter,
          },
        },
      });
      return mutate.data;
    },
    staleTime: 15 * 60 * 1000,
  });
};

export const useAllGlofasProbFlood = (uuid: UUID, payload: any) => {
  const t = useTranslations('AA_PROJECT');
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });

  const query = useQuery({
    queryKey: [FORECAST_QUERY_KEYS.GLOFAS_PROB_FLOOD_ALL, uuid],
    queryFn: async () => {
      try {
        const mutate = await q.mutateAsync({
          uuid,
          data: {
            action: 'ms.probFlood.getAllGlofas',
            payload: payload,
          },
        });
        return mutate.data;
      } catch (error: any) {
        toast.fire({
          title: t('ERROR_LOADING_GLOFAS_DETAILS'),
          text: t('FAILED_TO_FETCH_GLOFAS_DETAILS'),
          icon: 'error',
        });
      }
    },
    staleTime: 5 * 60 * 60 * 1000, // 5 hrs
  });

  return query;
};

export const useGlofasProbFloodDetails = (uuid: UUID, payload: any) => {
  const t = useTranslations('AA_PROJECT');
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });

  const query = useQuery({
    queryKey: [
      FORECAST_QUERY_KEYS.GLOFAS_PROB_FLOOD_DETAILS,
      uuid,
      payload?.returnPeriod,
    ],
    queryFn: async () => {
      try {
        const mutate = await q.mutateAsync({
          uuid,
          data: {
            action: 'ms.probFlood.getOneGlofas',
            payload: payload,
          },
        });
        return mutate.data;
      } catch (error: any) {
        toast.fire({
          title: t('ERROR_LOADING_GLOFAS_DETAILS'),
          text: t('FAILED_TO_FETCH_GLOFAS_DETAILS'),
          icon: 'error',
        });
      }
    },
    staleTime: 5 * 60 * 60 * 1000, // 5 hrs
  });

  return query;
};

export const useGFHWaterLevels = (uuid: UUID, payload: any) => {
  const t = useTranslations('AA_PROJECT');
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });

  const query = useQuery({
    queryKey: [FORECAST_QUERY_KEYS.GFH_WATER_LEVELS, uuid],
    queryFn: async () => {
      try {
        const mutate = await q.mutateAsync({
          uuid,
          data: {
            action: 'ms.waterLevels.getGfh',
            payload: payload,
          },
        });
        return mutate.data;
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          t('FAILED_TO_FETCH_GFH_WATER_LEVELS');
        toast.fire({
          title: t('ERROR_LOADING_GFH_WATER_LEVELS'),
          text: errorMessage,
          icon: 'error',
        });
        throw error;
      }
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  return query;
};

export const useAATriggerStatements = (uuid: UUID, payload: any) => {
  const q = useProjectAction();
  const { setTriggers } = useAAStationsStore((state) => ({
    setTriggers: state.setTriggers,
  }));
  const { settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
  }));

  const query = useQuery({
    queryKey: [PHASE_QUERY_KEYS.TRIGGER_STATEMENT, uuid, payload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.triggers.getAll',
          payload: {
            ...payload,
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
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
  React.useEffect(() => {
    if (query.data) {
      setTriggers(query?.data);
    }
  }, [query.data]);
  return query.data;
};

export const useSingleTriggerStatement = (
  uuid: UUID,
  triggerId: string | string[] | number,
  version?: boolean,
) => {
  const t = useTranslations('AA_PROJECT');
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });

  const action = version ? 'ms.revertPhase.getOne' : 'ms.triggers.getOne';
  const payload = version
    ? {
        id: triggerId,
      }
    : {
        uuid: triggerId,
      };
  const query = useQuery({
    queryKey: ['triggerStatement', uuid, payload],
    queryFn: async () => {
      try {
        const mutate = await q.mutateAsync({
          uuid,
          data: {
            action: action,
            payload,
          },
        });
        return mutate.data;
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          t(
            version
              ? 'FAILED_TO_FETCH_VERSION_DETAILS'
              : 'FAILED_TO_FETCH_TRIGGER_STATEMENT_DETAILS',
          );

        toast.fire({
          title: t(version ? 'ERROR_LOADING_VERSION' : 'ERROR_LOADING_TRIGGER_STATEMENT'),
          text: errorMessage,
          icon: 'error',
        });
        throw error;
      }
    },
  });
  return query;
};

export const useActivateTrigger = () => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const qc = useQueryClient();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  const chainSettings = useSettingsStore((state) => state.projectChainSettings);

  return useMutation({
    mutationFn: async ({
      projectUUID,
      activatePayload,
    }: {
      projectUUID: UUID;
      activatePayload: {
        uuid: string;
        notes?: string;
        triggerDocuments?: Array<{ mediaURL: string; fileName: string }>;
      };
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'ms.triggers.activate',
          payload: activatePayload,
        },
      });
    },
    onSuccess: (_, variables) => {
      q.reset();
      qc.invalidateQueries({
        queryKey: ['triggerStatement', variables.projectUUID],
      });
      toast.fire({
        title: t('TRIGGER_ACTIVATED'),
        text: t('SUCCESSFULLY_ACTIVATED_TRIGGER_YOU_CAN_VIEW_DETAILS_OF_THIS'),
        timer: 10000,
        icon: 'success',
        width: '500px',
        showCloseButton: true,
        closeButtonHtml:
          '<span style="color: #ef4444; font-size: 20px; font-weight: bold; position: absolute; top: 10px; right: 15px; cursor: pointer;">&times;</span>',
      });
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
      toast.fire({
        title: t('TRIGGER_ACTIVATION_FAILED'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useUpdateTriggerStatement = () => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
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
      triggerUpdatePayload,
    }: {
      projectUUID: UUID;
      triggerUpdatePayload: any;
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'ms.triggers.update',
          payload: triggerUpdatePayload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({ queryKey: ['triggerStatements'] });
      qc.invalidateQueries({ queryKey: ['triggerStatement'] });
      toast.fire({
        title: t('TRIGGER_UPDATED_SUCCESSFULLY'),
        icon: 'success',
      });
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
      toast.fire({
        title: t('ERROR_WHILE_UPDATING_TRIGGER'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useExternalApiHealthMonitor = (uuid: UUID) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['ms.sources.getHealth', uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.sources.getHealth',
          payload: {},
        },
      });
      return mutate.data;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  return query;
};

export const useGetDataSourceTypes = (uuid: UUID) => {
  const q = useProjectAction([MS_TRIGGERS_KEYS.DATASOURCETYPES]);
  const query = useQuery({
    queryKey: [MS_TRIGGERS_KEYS.DATASOURCETYPES, uuid],
    staleTime: Infinity,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.settings.get',
          payload: {
            name: MS_TRIGGERS_KEYS.DATASOURCETYPES,
          },
        },
      });
      return mutate.data;
    },
  });

  return query;
};

export const useGetSeriesByDataSource = (
  uuid: UUID,
  dataSource: string,
  type: string,
  levelType: string,
) => {
  const t = useTranslations('AA_PROJECT');
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });

  const q = useProjectAction([MS_TRIGGERS_KEYS.SERIES]);
  const { settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
  }));

  return useQuery({
    queryKey: [MS_TRIGGERS_KEYS.SERIES, uuid, dataSource, type, levelType],
    staleTime: 0,
    enabled: !!dataSource && !!type && !!levelType,
    queryFn: async () => {
      try {
        const mutate = await q.mutateAsync({
          uuid,
          data: {
            action: 'ms.sourcesData.getSeriesByDataSource',
            payload: {
              dataSource,
              type,
              levelType,
              riverBasin:
                settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.[
                  'river_basin'
                ],
            },
          },
        });
        return mutate.data;
      } catch (error: any) {
        toast.fire({
          title: t('ERROR_LOADING_SERIES'),
          text: t('FAILED_TO_FETCH_SERIES_FOR_THE_SELECTED_SOURCE'),
          icon: 'error',
        });
      }
    },
  });
};

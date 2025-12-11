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

export const useCreateTriggerStatement = () => {
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
      toast.fire({
        title: 'Trigger statement added successfully.',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useAddTriggerStatementToPhase = () => {
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
      toast.fire({
        title: 'Trigger statement added successfully.',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useDeleteTriggerStatement = () => {
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
        repeatKey: string;
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
      qc.invalidateQueries({ queryKey: ['triggerstatements'] });
      toast.fire({
        title: 'Trigger statement removed successfully.',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while removing trigger statement.',
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
    queryKey: ['dhmwaterlevels', uuid, activeTab, from, to],
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

export const useDhmRainfallLevels = (uuid: UUID, payload: any) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['dhmrainfalllevels', uuid],
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
  });

  return query;
};

export const useGlofasWaterLevels = (uuid: UUID, payload: any) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['glofaswaterlevels', uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.waterLevels.getGlofas',
          payload: payload,
        },
      });
      return mutate.data;
    },
  });

  return query;
};

export const useGFHWaterLevels = (uuid: UUID, payload: any) => {
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });

  const query = useQuery({
    queryKey: ['gfhwaterlevels', uuid],
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
          error?.response?.data?.message || 'Failed to fetch GFH water levels';
        toast.fire({
          title: 'Error loading GFH water levels',
          text: errorMessage,
          icon: 'error',
        });
        throw error;
      }
    },
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
    queryKey: ['triggerstatements', uuid, payload],
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
  repeatKey: string | string[] | number,
  version: boolean,
) => {
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
        id: repeatKey,
      }
    : {
        repeatKey: repeatKey,
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
          `Failed to fetch ${
            version ? 'version' : 'trigger statement'
          } details`;

        toast.fire({
          title: `Error loading ${version ? 'version' : 'trigger statement'}`,
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
        repeatKey: string | string[];
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
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({ queryKey: ['triggerstatement'] });
      toast.fire({
        title: 'Trigger activated.',
        text: 'Successfully activated trigger. You can view details of this from trigger details page.',
        timer: 10000,
        icon: 'success',
        width: '500px',
        showCloseButton: true,
        closeButtonHtml:
          '<span style="color: #ef4444; font-size: 20px; font-weight: bold; position: absolute; top: 10px; right: 15px; cursor: pointer;">&times;</span>',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Trigger activation failed.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useUpdateTriggerStatement = () => {
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
        title: 'Trigger updated successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while updating trigger.',
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

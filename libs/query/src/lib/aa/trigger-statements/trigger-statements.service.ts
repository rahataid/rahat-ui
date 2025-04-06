'use client';
import { UUID } from 'crypto';
import { useAAStationsStore } from './trigger-statements.store';
import { useProjectAction } from '../../projects/projects.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useSwal } from '../../../swal';

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

export const useDhmWaterLevels = (uuid: UUID) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['dhmwaterlevels', uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aaProject.waterLevels.getDhm',
          payload: {
            page: 1,
            perPage: 15,
          },
        },
      });
      return mutate.data;
    },
  });

  return query;
};

export const useGlofasWaterLevels = (uuid: UUID) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['glofaswaterlevels', uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aaProject.waterLevels.getGlofas',
          payload: {},
        },
      });
      return mutate.data;
    },
  });

  return query;
};

export const useAATriggerStatements = (uuid: UUID, payload: any) => {
  const q = useProjectAction();
  const { setTriggers } = useAAStationsStore((state) => ({
    setTriggers: state.setTriggers,
  }));

  const query = useQuery({
    queryKey: ['triggerstatements', uuid, payload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.triggers.getAll',
          payload: { ...payload, riverBasin: 'Karnali', activeYear: '2024' },
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
  repeatKey: string | string[],
) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['triggerStatement', uuid, repeatKey],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.triggers.getOne',
          payload: {
            repeatKey: repeatKey,
          },
        },
      });
      return mutate.data;
    },
  });
  return query?.data;
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
        icon: 'success',
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

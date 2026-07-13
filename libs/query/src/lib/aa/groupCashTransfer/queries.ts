'use client';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { useProjectAction, useProjectSettingsStore } from '../../projects';
import { PROJECT_SETTINGS_KEYS } from 'libs/query/src/config';
import { runAction, ACTION_NS } from './utils';
import { ListGroupCashTransferParams, ListGctRecordsParams } from './types';

export const useGroupCashTransfers = (
  projectUUID: UUID,
  params: ListGroupCashTransferParams = {},
) => {
  const q = useProjectAction();
  const paramsKey = JSON.stringify(params);

  return useQuery({
    queryKey: [ACTION_NS + '.get', projectUUID, paramsKey],
    staleTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
    queryFn: () => runAction(q, projectUUID, ACTION_NS + '.get', { ...params }),
  });
};

export const useGetOneGroupCashTransfer = (projectUUID: UUID, uuid: string) => {
  const q = useProjectAction();

  return useQuery({
    queryKey: [ACTION_NS + '.getOne', projectUUID, uuid],
    enabled: !!uuid,
    refetchOnMount: true,
    queryFn: () => runAction(q, projectUUID, ACTION_NS + '.getOne', { uuid }),
  });
};

export const useGctRecords = (
  projectUUID: UUID,
  params: ListGctRecordsParams = {},
) => {
  const q = useProjectAction();
  const paramsKey = JSON.stringify(params);

  return useQuery({
    queryKey: [ACTION_NS + '.getRecords', projectUUID, paramsKey],
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
    queryFn: () =>
      runAction(q, projectUUID, ACTION_NS + '.getRecords', { ...params }),
  });
};

export const useGetAllValidGroupCashTransfers = (projectUUID: UUID) => {
  const q = useProjectAction();

  return useQuery({
    queryKey: [ACTION_NS + '.getAllValid', projectUUID],
    staleTime: 0,
    queryFn: () => runAction(q, projectUUID, ACTION_NS + '.getAllValid', {}),
  });
};

export const useGetOneGctRecord = (projectUUID: UUID, recordUuid: string) => {
  const q = useProjectAction();

  return useQuery({
    queryKey: [ACTION_NS + '.getOneRecord', projectUUID, recordUuid],
    enabled: !!recordUuid,
    refetchOnMount: true,
    queryFn: () =>
      runAction(q, projectUUID, ACTION_NS + '.getOneRecord', {
        uuid: recordUuid,
      }),
  });
};

export const usePhasePayoutStatus = (projectUUID: UUID) => {
  const q = useProjectAction();
  const { settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
  }));

  const activeYear =
    settings?.[projectUUID]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.[
      'active_year'
    ];
  const riverBasin =
    settings?.[projectUUID]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.[
      'river_basin'
    ];

  return useQuery({
    queryKey: ['phasePayoutStatus', projectUUID, activeYear, riverBasin],
    enabled: !!(projectUUID && activeYear && riverBasin),
    queryFn: async () => {
      const res = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'ms.phase.getPhasePayoutStatus',
          payload: {
            activeYear,
            riverBasin,
            disbursementMethod: 'GROUP_TOKEN',
          },
        },
      });
      return res.data;
    },
  });
};

export const useGetGctData = (projectUUID: UUID) => {
  const q = useProjectAction();

  return useQuery({
    queryKey: [ACTION_NS + '.getGCTData', projectUUID],
    refetchOnMount: true,
    queryFn: () => runAction(q, projectUUID, ACTION_NS + '.getGCTData', {}),
  });
};

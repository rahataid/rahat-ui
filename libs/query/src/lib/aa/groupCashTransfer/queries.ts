'use client';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { useProjectAction } from '../../projects';
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

export const useGetOneGroupCashTransfer = (
  projectUUID: UUID,
  uuid: string,
) => {
  const q = useProjectAction();

  return useQuery({
    queryKey: [ACTION_NS + '.getOne', projectUUID, uuid],
    enabled: !!uuid,
    refetchOnMount: true,
    queryFn: () =>
      runAction(q, projectUUID, ACTION_NS + '.getOne', { uuid }),
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

export const useGetOneGctRecord = (
  projectUUID: UUID,
  recordUuid: string,
) => {
  const q = useProjectAction();

  return useQuery({
    queryKey: [ACTION_NS + '.getOneRecord', projectUUID, recordUuid],
    enabled: !!recordUuid,
    refetchOnMount: true,
    queryFn: () =>
      runAction(q, projectUUID, ACTION_NS + '.getOneRecord', { uuid: recordUuid }),
  });
};

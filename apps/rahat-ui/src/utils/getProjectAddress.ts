import { UseMutationResult } from '@tanstack/react-query';
import { PROJECT_SETTINGS } from '../constants/project.const';
import { type Address } from 'viem';

export const getProjectSettings = async (
  getProject: UseMutationResult<any, Error, any, unknown>,
  uuid: string | string[] | undefined,
) => {
  const res = await getProject.mutateAsync({
    uuid,
    data: {
      action: 'settings.list',
      payload: {},
    },
  });

  return res?.data;
};

export const getProjectAddress = async (
  getProject: UseMutationResult<any, Error, any, unknown>,
  uuid: string | string[] | undefined,
) => {
  const res = await getProject.mutateAsync({
    uuid,
    data: {
      action: 'settings.get',
      payload: {
        name: PROJECT_SETTINGS.CONTRACTS,
      },
    },
  });

  return res?.data;
};

export const shortenAddress = (address: Address) => {
  if (!address) return '';
  const start = address.slice(0, 6);
  const end = address.slice(address.length - 4);
  return `${start}...${end}`;
};

export const shortenTxHash = (txHash: string) => {
  if (!txHash) return '';
  const start = txHash.slice(0, 15);
  const end = txHash.slice(txHash.length - 10);
  return `${start}...${end}`;
};

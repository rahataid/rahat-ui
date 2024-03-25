import { UseMutationResult } from '@tanstack/react-query';
import { PROJECT_SETTINGS } from '../constants/project.const';

export const getProjectSettings = async (
  getProject: UseMutationResult<any, Error, any, unknown>,
  uuid: string | undefined,
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
  uuid: string | undefined,
) => {
  const res = await getProject.mutateAsync({
    uuid,
    data: {
      action: 'settings.get',
      payload: {
        name:PROJECT_SETTINGS.CONTRACTS
      },
    },
  });

  return res?.data;
};

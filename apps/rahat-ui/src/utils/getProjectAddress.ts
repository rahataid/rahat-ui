import { UseMutationResult } from '@tanstack/react-query';

export const getProjectAddress = async (
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

import { getAppClient } from '@rahataid/sdk/clients';
import { useRSQuery } from '@rumsan/react-query';
import { Pagination } from '@rumsan/sdk/types';
import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { useTranslations } from 'next-intl';
import Swal from 'sweetalert2';
import { resolveBackendErrorMessage } from '../../utils/i18n/backend-error';

export const useCreateAuthApp = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const appClient = getAppClient(rumsanService.client);
  const t = useTranslations();
  return useMutation(
    {
      mutationKey: ['CREATE_AUTH_APP'],
      mutationFn: appClient.createAuthApp,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            'CREATE_AUTH_APP',
            {
              exact: true,
            },
          ],
        });
        Swal.fire('Auth App Create Sucessfully', '', 'success');
      },
      onError: (error: any) => {
        const code = error?.response?.data?.code;
        const name = error?.response?.data?.name;
        const rawMessage = error.response.data.message.includes(
          'Unique constraint',
        )
          ? 'Public Key already exist'
          : error.response.data.message;
        const errorMessage = resolveBackendErrorMessage(
          t,
          code || name,
          error?.response?.data?.params,
          ['USERS'],
          rawMessage,
        );
        Swal.fire('Error', errorMessage, 'error');
      },
    },
    queryClient,
  );
};

export const useListAuthApps = (
  payload: Pagination & { any?: string },
): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const appClient = getAppClient(rumsanService.client);
  return useQuery(
    {
      queryKey: ['LIST_AUTH_APPS', payload],
      queryFn: () => appClient.listAuthApps(payload),
    },
    queryClient,
  );
};

export const useGetAuthApp = (uuid: UUID): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const appClient = getAppClient(rumsanService.client);
  return useQuery(
    {
      queryKey: ['GET_AUTH_APP', uuid],
      queryFn: () => appClient.getAuthApp(uuid),
    },
    queryClient,
  );
};

export const useUpdateAuthApp = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const appClient = getAppClient(rumsanService.client);
  const t = useTranslations();
  return useMutation(
    {
      mutationKey: ['UPDATE_AUTH_APP'],
      mutationFn: appClient.updateAuthApp,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            'LIST_AUTH_APPS',
            {
              exact: true,
            },
          ],
        });
        Swal.fire('Auth App Update Sucessfully', '', 'success');
      },
      onError: (error: any) => {
        const code = error?.response?.data?.code;
        const name = error?.response?.data?.name;
        const errorMessage = resolveBackendErrorMessage(
          t,
          code || name,
          error?.response?.data?.params,
          ['USERS'],
          error.response.data.message || 'Encounter error on Updating Data',
        );
        Swal.fire('Error', errorMessage, 'error');
      },
    },
    queryClient,
  );
};

export const usesoftDeleteAuthApp = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const appClient = getAppClient(rumsanService.client);
  const t = useTranslations();
  return useMutation(
    {
      mutationKey: ['DELETE_AUTH_APP'],
      mutationFn: appClient.softDeleteAuthApp,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            'LIST_AUTH_APPS',
            {
              exact: true,
            },
          ],
        });
        Swal.fire('Auth App Delete Sucessfully', '', 'success');
      },
      onError: (error: any) => {
        const code = error?.response?.data?.code;
        const name = error?.response?.data?.name;
        const errorMessage = resolveBackendErrorMessage(
          t,
          code || name,
          error?.response?.data?.params,
          ['USERS'],
          error.response.data.message || 'Encounter error on Deleting Data',
        );
        Swal.fire('Error', errorMessage, 'error');
      },
    },
    queryClient,
  );
};

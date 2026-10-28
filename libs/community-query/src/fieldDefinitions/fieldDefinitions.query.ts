import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useRSQuery } from '@rumsan/react-query';
import { getFieldDefinitionClient } from '@rahataid/community-tool-sdk/clients';
import { TAGS } from '../config';
import { Pagination } from '@rumsan/sdk/types';
import Swal from 'sweetalert2';
import { getTranslate } from '../translate';

export const useFieldDefinitionsList = (
  payload: Pagination & { isTargeting?: boolean },
): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const fieldDefClient = getFieldDefinitionClient(rumsanService.client);

  const query = useQuery(
    {
      queryKey: [TAGS.LIST_COMMUNITY_FIELD_DEFINITIONS, payload],
      queryFn: () => fieldDefClient.list(payload),
    },
    queryClient,
  );

  return query;
};

export const useActiveFieldDefList = (
  payload: Pagination & { isTargeting?: boolean },
): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const fieldDefClient = getFieldDefinitionClient(rumsanService.client);

  const query = useQuery(
    {
      queryKey: [TAGS.LIST_ACTIVE_FIELD_DEFINITIONS, payload],
      queryFn: () => fieldDefClient.listActive(payload),
    },
    queryClient,
  );

  return query;
};

export const useFieldDefinitionsCreate = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const fieldDefClient = getFieldDefinitionClient(rumsanService.client);

  return useMutation(
    {
      mutationKey: [TAGS.CREATE_COMMUNITY_FIELD_DEFINITIONS],
      mutationFn: fieldDefClient.create,
      onSuccess: () => {
        const t = getTranslate();
        Swal.fire(t('FIELD_DEFINITION_CREATED_SUCCESSFULLY'), '', 'success');
        queryClient.invalidateQueries({
          queryKey: [
            TAGS.LIST_COMMUNITY_FIELD_DEFINITIONS,
            {
              exact: true,
            },
          ],
        });
      },
      onError: (error: any) => {
        const t = getTranslate();
        Swal.fire(
          t('ERROR'),
          error.response.data.message || t('ERROR_ON_CREATING_DATA'),
          'error',
        );
      },
    },
    queryClient,
  );
};

export const useFieldDefinitionsUpdate = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const qc = useQueryClient();
  const fieldDefClient = getFieldDefinitionClient(rumsanService.client);

  return useMutation(
    {
      mutationKey: [TAGS.UPDATE_COMMUNITY_FIELD_DEFINITIONS, 'id'],
      mutationFn: fieldDefClient.update,
      onSuccess: () => {
        const t = getTranslate();
        Swal.fire(t('FIELD_DEFINITION_UPDATED_SUCCESSFULLY'), '', 'success');
        qc.invalidateQueries({
          queryKey: [TAGS.LIST_COMMUNITY_FIELD_DEFINITIONS],
        });
      },
      onError: (error: any) => {
        const t = getTranslate();
        Swal.fire(
          t('ERROR'),
          error.response.data.message || t('ERROR_ON_CREATING_DATA'),
          'error',
        );
      },
    },
    queryClient,
  );
};

export const useFieldDefinitionsStatusUpdate = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const fieldDefClient = getFieldDefinitionClient(rumsanService.client);

  return useMutation(
    {
      mutationKey: [TAGS.UPDATE_COMMUNITY_FIELD_DEFINITIONS_STATUS, 'id'],
      mutationFn: fieldDefClient.toggleStatus,
      onSuccess: () => {
        const t = getTranslate();
        Swal.fire(
          t('FIELD_DEFINITION_STATUS_UPDATED_SUCCESSFULLY'),
          '',
          'success',
        );
        queryClient.invalidateQueries({
          queryKey: [
            TAGS.LIST_COMMUNITY_FIELD_DEFINITIONS,
            {
              exact: true,
            },
          ],
        });
      },
      onError: (error: any) => {
        const t = getTranslate();
        Swal.fire(
          t('ERROR'),
          error.response.data.message || t('ERROR_ON_CREATING_DATA'),
          'error',
        );
      },
    },
    queryClient,
  );
};

export const useFieldDefinitionsListById = (
  id: string,
): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const fieldDefClient = getFieldDefinitionClient(rumsanService.client);

  const query = useQuery(
    {
      queryKey: [TAGS.LIST_COMMUNITY_FIELD_DEFINITIONS, id],
      queryFn: () => fieldDefClient.listById(id),
    },
    queryClient,
  );

  return query;
};

export const useUniqueFieldDefinitionsList = (): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const fieldDefClient = getFieldDefinitionClient(rumsanService.client);

  const query = useQuery(
    {
      queryKey: [TAGS.LIST_UNIQUE_FIELD_DEFINITIONS],
      queryFn: () => fieldDefClient.listUnique(),
    },
    queryClient,
  );

  return query;
};

export const useAddBulkFile = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const fieldDefClient = getFieldDefinitionClient(rumsanService.client);

  return useMutation(
    {
      mutationKey: [TAGS.ADD_BULK_FIELD_DEFINITIONS],
      mutationFn: fieldDefClient.addBulk,
      onSuccess: () => {
        const t = getTranslate();
        Swal.fire(t('FIELD_DEFINITION_IMPORTED_SUCCESSFULLY'), '', 'success');
        queryClient.invalidateQueries({
          queryKey: [
            TAGS.LIST_COMMUNITY_FIELD_DEFINITIONS,
            {
              exact: true,
            },
          ],
        });
      },
      onError: (error: any) => {
        const t = getTranslate();
        Swal.fire(
          t('ERROR'),
          error?.response?.data?.message || t('ERROR_ON_CREATING_DATA'),
          'error',
        );
      },
    },
    queryClient,
  );
};

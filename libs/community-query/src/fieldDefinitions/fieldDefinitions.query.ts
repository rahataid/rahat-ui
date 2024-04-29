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
        Swal.fire('Field Definition Created Successfully', '', 'success');
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
        Swal.fire(
          'Error',
          error.response.data.message || 'Encounter error on Creating Data',
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
        Swal.fire('Field Definition Updated Successfully', '', 'success');
        qc.invalidateQueries({
          queryKey: [TAGS.LIST_COMMUNITY_FIELD_DEFINITIONS],
        });
      },
      onError: (error: any) => {
        Swal.fire(
          'Error',
          error.response.data.message || 'Encounter error on Creating Data',
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
        Swal.fire(
          'Field Definition Status Updated Successfully',
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
        Swal.fire(
          'Error',
          error.response.data.message || 'Encounter error on Creating Data',
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

export const useAddBulkFile = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const fieldDefClient = getFieldDefinitionClient(rumsanService.client);

  return useMutation(
    {
      mutationKey: [TAGS.ADD_BULK_FIELD_DEFINITIONS],
      mutationFn: fieldDefClient.addBulk,
      onSuccess: () => {
        Swal.fire('Field Definition Imported Successfully', '', 'success');
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
        Swal.fire(
          'Error',
          error?.response?.data?.message || 'Encounter error on Creating Data',
          'error',
        );
      },
    },
    queryClient,
  );
};

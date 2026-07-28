import { getGroupClient } from '@rahataid/community-tool-sdk/clients';
import { GroupPurge } from '@rahataid/community-tool-sdk/groups';
import { useRSQuery } from '@rumsan/react-query';
import { Pagination } from '@rumsan/sdk/types';
import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { TAGS } from '../config';
import { getTranslate } from '../translate';

type GroupState = {
  uuid: string;
  pathName: string;
};
export const useCommunityGroupCreate = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const groupClient = getGroupClient(rumsanService.client);
  return useMutation({
    mutationKey: [TAGS.ADD_COMMUNITY_GROUP],
    mutationFn: groupClient.create,
    onSuccess: () => {
      const t = getTranslate();
      Swal.fire(t('GROUP_CREATED_SUCCESSFULLY'), '', 'success');
      queryClient.invalidateQueries({
        queryKey: [TAGS.LIST_COMMUNITY_GROUP],
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
  });
};

export const useCommunityGroupUpdate = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const groupClient = getGroupClient(rumsanService.client);
  return useMutation({
    mutationKey: [TAGS.UPDATE_GROUP],
    mutationFn: groupClient.update,
    onSuccess: () => {
      const t = getTranslate();
      Swal.fire(t('GROUP_UPDATED_SUCCESSFULLY'), '', 'success');
      queryClient.invalidateQueries({
        queryKey: [TAGS.LIST_COMMUNITY_GROUP],
      });
    },
    onError: (error: any) => {
      const t = getTranslate();
      Swal.fire(
        t('ERROR'),
        error.response.data.message || t('SOMETHING_WENT_WRONG'),
        'error',
      );
    },
  });
};

export const useCommunityGroupList = (
  payload: Pagination & { any?: string },
): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const groupClient = getGroupClient(rumsanService.client);
  const query = useQuery(
    {
      queryKey: [TAGS.LIST_COMMUNITY_GROUP, payload],
      queryFn: () => groupClient.list(payload),
    },
    queryClient,
  );
  return query;
};

export const useCommunityGroupListByID = (
  uuid: string,
  query: any,
): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const groupClient = getGroupClient(rumsanService.client);
  return useQuery(
    {
      queryKey: [TAGS.LIST_COMMUNITY_GROUP_BY_ID, query, uuid],
      queryFn: () => groupClient.listById(uuid, query),
    },
    queryClient,
  );
};

export const useCommunityGroupedBeneficiariesDownload = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const groupClient = getGroupClient(rumsanService.client);
  return useMutation(
    {
      mutationKey: [TAGS.DOWNLOAD_COMMUNITY_GROUPED_BENEFICIARIES],
      mutationFn: groupClient.download,
    },
    queryClient,
  );
};

export const useCommunityGroupRemove = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const groupClient = getGroupClient(rumsanService.client);

  return useMutation(
    {
      mutationKey: [TAGS.REMOVE_COMMUNITY_GROUP],
      mutationFn: groupClient.remove,
      onSuccess: () => {
        const t = getTranslate();
        Swal.fire(t('BENEFICIARY_DISCONNECTED_SUCCESSFULLY'), '', 'success');
        queryClient.invalidateQueries({
          queryKey: [TAGS.LIST_COMMUNITY_GROUP],
        });
      },
      onError: (error: any) => {
        const t = getTranslate();
        Swal.fire({
          icon: 'error',
          title:
            error?.response?.data?.message ||
            t('ERROR_ON_REMOVING_DATA'),
        });
      },
    },
    queryClient,
  );
};

export const usePurgeGroupedBeneficiary = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const qc = useQueryClient();
  const groupClient = getGroupClient(rumsanService.client);

  return useMutation(
    {
      mutationKey: [TAGS.PURGE_COMMUNITY_GROUP],
      mutationFn: async (data: GroupPurge) => {
        const t = getTranslate();
        const { isConfirmed } = await Swal.fire({
          title: t('CAUTION'),
          text: t('DELETE_BENEFICIARIES_WARNING'),
          icon: 'warning',
          showDenyButton: true,
          confirmButtonText: t('CONFIRM_YES_I_AM_SURE'),
          denyButtonText: t('CONFIRM_NO_CANCEL'),
          customClass: {
            actions: 'my-actions',
            confirmButton: 'order-1',
            denyButton: 'order-2',
          },
        });

        if (!isConfirmed) return;
        return groupClient.purgeGroup(data);
      },
      onSuccess: (data) => {
        if (!data) return;
        const t = getTranslate();
        Swal.fire(t('BENEFICIARIES_DELETED_SUCCESSFULLY'), '', 'success');
        qc.invalidateQueries({ queryKey: [TAGS.LIST_COMMUNITY_GROUP_BY_ID] });
      },
      onError: (error: any) => {
        const t = getTranslate();
        Swal.fire({
          icon: 'error',
          title:
            error?.response?.data?.message ||
            t('ERROR_ON_REMOVING_DATA'),
        });
      },
    },
    queryClient,
  );
};

export const useCommunityGroupDelete = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const groupClient = getGroupClient(rumsanService.client);
  return useMutation(
    {
      mutationKey: [TAGS.REMOVE_COMMUNITY_GROUP],
      mutationFn: async (data: GroupState) => {
        const t = getTranslate();
        const { isConfirmed } = await Swal.fire({
          title: `${
            data?.pathName === '/group' ? t('DELETE_GROUP_LABEL') : t('DELETE_IMPORTS_LOGS_LABEL')
          }`,
          text: t('CONFIRM_DELETE_PERMANENTLY'),
          showCancelButton: true,
          confirmButtonText: t('DELETE'),
          cancelButtonText: t('CANCEL'),
          confirmButtonColor: '#dc3545',
          allowOutsideClick: false,
        });
        if (!isConfirmed) return null;
        return groupClient.deleteGroup(data?.uuid as string);
      },
      onSuccess: (data: any) => {
        if (data)
          Swal.fire({
            icon: 'success',
            title: data?.response?.data,
          });
        queryClient.invalidateQueries({
          queryKey: [TAGS.LIST_COMMUNITY_GROUP],
        });
      },
      onError: (error: any) => {
        const t = getTranslate();
        Swal.fire({
          icon: 'error',
          title:
            error?.response?.data?.message ||
            t('ERROR_ON_REMOVING_DATA'),
        });
      },
    },
    queryClient,
  );
};

export const useBulkGenerateVerificationLink = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const grpClient = getGroupClient(rumsanService.client);
  return useMutation(
    {
      mutationKey: [TAGS.BULK_GENERATE_LINK],
      mutationFn: grpClient.bulkGenerateLink,
      onSuccess: (data: any) => {
        const t = getTranslate();
        Swal.fire({
          title: t('SUCCESS'),
          text: data?.data,

          icon: 'success',
        });
        queryClient.invalidateQueries({
          queryKey: [
            TAGS.LIST_COMMUNITY_GROUP,
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

export const useUploadBulkBeneficiaryUpdate = () => {
  const { queryClient, rumsanService } = useRSQuery();

  const beneficiaryGroupClient = getGroupClient(rumsanService.client);

  return useMutation({
    mutationKey: [TAGS.UPDATE_BULK_BENEFICIARY],

    mutationFn: async ({
      groupUUID,
      data,

      uniqueField,
    }: {
      groupUUID: string;
      data: FormData;
      uniqueField?: string;
    }) => {
      return beneficiaryGroupClient.updateInBulk(
        groupUUID,
        data,
        undefined,
        uniqueField,
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [TAGS.LIST_COMMUNITY_BENFICIARIES],
      });
    },

    onError: (error: any) => {
      const t = getTranslate();
      Swal.fire({
        icon: 'error',
        title:
          error?.response?.data?.message ||
          t('ERROR_WHILE_UPDATING_DATA'),
      });
    },
  });
};

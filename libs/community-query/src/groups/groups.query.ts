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
      Swal.fire('Group Created Successfully', '', 'success');
      queryClient.invalidateQueries({
        queryKey: [TAGS.LIST_COMMUNITY_GROUP],
      });
    },
    onError: (error: any) => {
      Swal.fire(
        'Error',
        error.response.data.message || 'Encounter error on Creating Data',
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
      Swal.fire('Group updated Successfully', '', 'success');
      queryClient.invalidateQueries({
        queryKey: [TAGS.LIST_COMMUNITY_GROUP],
      });
    },
    onError: (error: any) => {
      Swal.fire(
        'Error',
        error.response.data.message || 'Something went wrong!',
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
        Swal.fire('Beneficiary Disconnected Successfully', '', 'success');
        queryClient.invalidateQueries({
          queryKey: [TAGS.LIST_COMMUNITY_GROUP],
        });
      },
      onError: (error: any) => {
        Swal.fire({
          icon: 'error',
          title:
            error?.response?.data?.message ||
            'Encounter error on Removing Data',
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
        const { isConfirmed } = await Swal.fire({
          title: 'CAUTION!',
          text: ' Selected beneficiaries will be deleted permanently!',
          icon: 'warning',
          showDenyButton: true,
          confirmButtonText: 'Yes, I am sure!',
          denyButtonText: 'No, cancel it!',
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
        Swal.fire('Selected Beneficiaries deleted!', '', 'success');
        qc.invalidateQueries({ queryKey: [TAGS.LIST_COMMUNITY_GROUP_BY_ID] });
      },
      onError: (error: any) => {
        Swal.fire({
          icon: 'error',
          title:
            error?.response?.data?.message ||
            'Encounter error on Removing Data' ||
            'Operation Canceled',
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
        const { isConfirmed } = await Swal.fire({
          title: `${
            data?.pathName === '/group' ? 'Delete Group' : 'Delete Imports Logs'
          }`,
          text: 'Are you sure you want to delete permanently?',
          showCancelButton: true,
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
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
        Swal.fire({
          icon: 'error',
          title:
            error?.response?.data?.message ||
            'Encounter error on Removing Data',
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
        Swal.fire({
          title: 'Bulk Link Generated Successfully',
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

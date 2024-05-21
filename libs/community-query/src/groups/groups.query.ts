import { getGroupClient } from '@rahataid/community-tool-sdk/clients';
import { useRSQuery } from '@rumsan/react-query';
import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { TAGS } from '../config';
import { Pagination } from '@rumsan/sdk/types';
import { useEffect } from 'react';
import { GroupPurge, ListGroup } from '@rahataid/community-tool-sdk/groups';

export const useCommunityGroupCreate = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const groupClient = getGroupClient(rumsanService.client);
  return useMutation({
    mutationKey: [TAGS.ADD_COMMUNITY_GROUP],
    mutationFn: groupClient.create,
    onSuccess: () => {
      Swal.fire('Group Created Successfully', '', 'success');
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
  });
};

export const useCommunityGroupList = (
  payload: Pagination & { any?: string },
): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const groupClient = getGroupClient(rumsanService.client);
  // const { setGroups, setMeta } = useCommunityGroupStore((state) => ({
  //   setGroups: state.setGroups,
  //   setMeta: state.setMeta,
  // }));
  const query = useQuery(
    {
      queryKey: [TAGS.LIST_COMMUNITY_GROUP, { exact: true }, payload],
      queryFn: () => groupClient.list(payload),
    },
    queryClient,
  );
  // useEffect(() => {
  //   if (query.data) {
  //     setGroups(query.data.data as ListGroup[]);
  //     setMeta(query.data.response.meta);
  //   }
  // }, [query.data, setGroups]);
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
  const qc = useQueryClient();
  const groupClient = getGroupClient(rumsanService.client);

  return useMutation(
    {
      mutationKey: [TAGS.REMOVE_COMMUNITY_GROUP],
      mutationFn: groupClient.remove,
      onSuccess: () => {
        Swal.fire('Beneficiary Deleted Successfully', '', 'success');
        qc.invalidateQueries({ queryKey: [TAGS.LIST_COMMUNITY_GROUP] });
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

export const useCommunityGroupPurge = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const qc = useQueryClient();
  const groupClient = getGroupClient(rumsanService.client);

  return useMutation(
    {
      mutationKey: [
        TAGS.PURGE_COMMUNITY_GROUP,
        TAGS.LIST_COMMUNITY_BENFICIARIES,
        { exact: true },
      ],
      // TODO
      mutationFn: async (data: GroupPurge) =>
        await groupClient.purgeGroup(data),
      onSuccess: async (data: any) => {
        await Swal.fire('Selected Beneficiaries deleted!', '', 'success');
        await qc.invalidateQueries({
          queryKey: [
            TAGS.PURGE_COMMUNITY_GROUP,
            TAGS.LIST_COMMUNITY_BENFICIARIES,
            { exact: true },
          ],
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

export const useCommunityGroupDelete = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const qc = useQueryClient();
  const groupClient = getGroupClient(rumsanService.client);
  return useMutation(
    {
      mutationKey: [TAGS.REMOVE_COMMUNITY_GROUP],
      mutationFn: (uuid: string) => groupClient.deleteGroup(uuid as string),
      onSuccess: (data: any) => {
        Swal.fire({
          icon: data?.response?.data?.flag === 'true' ? 'success' : 'info',
          title: data?.response?.data?.message,
        });

        qc.invalidateQueries({
          queryKey: [
            TAGS.LIST_COMMUNITY_GROUP,
            {
              exact: true,
            },
          ],
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

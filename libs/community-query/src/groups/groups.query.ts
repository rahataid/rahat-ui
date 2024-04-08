import { getGroupClient } from '@rahataid/community-tool-sdk/clients';
import { useRSQuery } from '@rumsan/react-query';
import { UseQueryResult, useMutation, useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { TAGS } from '../config';
import { Pagination } from '@rumsan/sdk/types';
import { useEffect } from 'react';
import { ListGroup } from '@rahataid/community-tool-sdk/groups';

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
      queryKey: [TAGS.LIST_COMMUNITY_GROUP, payload],
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
): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const groupClient = getGroupClient(rumsanService.client);
  return useQuery(
    {
      queryKey: [TAGS.LIST_COMMUNITY_GROUP_BY_ID],
      queryFn: () => groupClient.listById(uuid),
    },
    queryClient,
  );
};

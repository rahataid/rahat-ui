import { getGroupClient } from '@rahataid/community-tool-sdk/clients';
import { GroupClient } from '@rahataid/community-tool-sdk/types';

import { RumsanService } from '@rumsan/sdk';
import {
  QueryClient,
  useMutation,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';

import { TAGS } from '../config';
import Swal from 'sweetalert2';

export class CommunityGroupQuery {
  private client: GroupClient;
  public qc;

  constructor(rsService: RumsanService, reactQueryClient: QueryClient) {
    this.client = getGroupClient(rsService.client);
    this.qc = reactQueryClient;
  }

  useCommunityGroupList = (payload: any): UseQueryResult<any, Error> => {
    return useQuery({
      refetchOnMount: true,
      queryKey: [TAGS.LIST_COMMUNITY_GROUP, payload],
      queryFn: async () => {
        const k = await this.client.list(payload);
        return k;
      },
    });
  };

  // useCommunityGroupListALL = (payload: any): UseQueryResult<any, Error> => {
  //   return useQuery({
  //     refetchOnMount: true,
  //     queryKey: [TAGS.LIST_COMMUNITY_GROUP, payload],
  //     queryFn: async () => {
  //       const k = await this.client.list(payload);
  //       const perPage = k.response.meta?.['total'];
  //       const fetchAll = await this.client.list(perPage);
  //       console.log(fetchAll);
  //       return fetchAll;
  //     },
  //   });
  // };

  useCommunityGroupListByID = (id: string): UseQueryResult<any, Error> => {
    return useQuery({
      refetchOnMount: true,
      queryKey: [TAGS.LIST_COMMUNITY_GROUP, id],
      queryFn: () => {
        return this.client.listById(id);
      },
    });
  };

  useCommunityGroupCreate = () => {
    return useMutation({
      mutationKey: [TAGS.ADD_COMMUNITY_GROUP],
      mutationFn: async (payload: any) => {
        console.log(payload);
        return this.client.create(payload);
      },
      onSuccess: async () => {
        await this.qc.invalidateQueries({
          queryKey: [TAGS.LIST_COMMUNITY_GROUP],
        });
        Swal.fire({
          icon: 'success',
          title: 'Group Created successfully',
        });
      },
      onError: (error: any) => {
        Swal.fire({
          icon: 'error',
          title: error.message || 'Encounter error on Creating Data',
        });
      },
    });
  };
}

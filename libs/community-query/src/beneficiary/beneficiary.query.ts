import { getBeneficiaryClient } from '@rahataid/community-tool-sdk/clients';
import { BeneficiaryClient } from '@rahataid/community-tool-sdk/types';

import { RumsanService } from '@rumsan/sdk';
import {
  QueryClient,
  useMutation,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';

import { TAGS } from '../config';
import Swal from 'sweetalert2';

export class BeneficiaryQuery {
  private client: BeneficiaryClient;
  public qc;

  constructor(rsService: RumsanService, reactQueryClient: QueryClient) {
    this.client = getBeneficiaryClient(rsService.client);
    this.qc = reactQueryClient;
  }

  useCommunityBeneficiaryList = (payload: any): UseQueryResult<any, Error> => {
    return useQuery({
      refetchOnMount: true,
      queryKey: [TAGS.LIST_COMMUNITY_BENFICIARIES, payload],
      queryFn: () => {
        return this.client.list(payload);
      },
    });
  };
  // useCommunityBeneficiaryListALL = (
  //   payload: any,
  // ): UseQueryResult<any, Error> => {
  //   return useQuery({
  //     // refetchOnMount: true,
  //     queryKey: [TAGS.LIST_COMMUNITY_BENFICIARIES, payload],
  //     queryFn: async () => {
  //       const k = await this.client.list(payload);
  //       const perPage = k.response.meta?.['total'];
  //       console.log('sdads', perPage);
  //       const fetchAll = await this.client.list({ perPage, page: 1 });
  //       console.log('fetch', fetchAll);
  //       return fetchAll;
  //     },
  //   });
  // };

  useCommunityBeneficiaryListByID = (
    uuid: string,
  ): UseQueryResult<any, Error> => {
    return useQuery({
      refetchOnMount: true,
      queryKey: [TAGS.GET_BENEFICIARY],
      queryFn: () => {
        return this.client.listById(uuid);
      },
    });
  };

  useCommunityBeneficiaryCreate = () => {
    return useMutation({
      mutationKey: [TAGS.CREATE_COMMUNITY_BENEFICARY],
      mutationFn: async (payload: any) => {
        console.log(payload);
        return this.client.create(payload);
      },
      onSuccess: async () => {
        await this.qc.invalidateQueries({
          queryKey: [TAGS.LIST_COMMUNITY_BENFICIARIES],
        });
        Swal.fire({
          icon: 'success',
          title: 'Beneficiary Created successfully',
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

  useCommunityBeneficiaryUpdate = () => {
    return useMutation({
      mutationKey: [TAGS.UPDATE_COMMUNITY_BENEFICARY],
      mutationFn: async ({ uuid, payload }: { uuid: string; payload: any }) => {
        return this.client.update({ uuid, payload });
      },
      onSuccess: async (data) => {
        await this.qc.invalidateQueries({
          queryKey: [TAGS.LIST_COMMUNITY_BENFICIARIES],
        });

        await this.qc.refetchQueries({
          queryKey: [TAGS.LIST_COMMUNITY_BENFICIARIES],
        });

        Swal.fire({
          icon: 'success',
          title: 'Beneficiary updated successfully',
        });
      },
      onError: (error: any) => {
        Swal.fire({
          icon: 'error',
          title: error.message || 'Encounter error on Updating Data',
        });
      },
    });
  };

  useCommunityBeneficiaryRemove = () => {
    return useMutation({
      mutationKey: [TAGS.REMOVE_COMMUNITY_BENEFICARY],
      mutationFn: async (uuid: string) => {
        return this.client.remove(uuid);
      },
      onSuccess: async (data) => {
        await this.qc.invalidateQueries({
          queryKey: [TAGS.LIST_COMMUNITY_BENFICIARIES],
        });

        await this.qc.refetchQueries({
          queryKey: [TAGS.LIST_COMMUNITY_BENFICIARIES],
        });

        Swal.fire({
          icon: 'success',
          title: 'Beneficiary Removed successfully',
        });
      },
      onError: (error: any) => {
        Swal.fire({
          icon: 'error',
          title: error.message || 'Encounter error on Removing Benificiary',
        });
      },
    });
  };

  useCommunityBeneficiaryCreateBulk = () => {
    return useMutation({
      mutationKey: [TAGS.CREATE_BULK_COMMUNITY_BENEFICARY],
      mutationFn: async (data: any) => {
        return this.client.createBulk(data);
      },
      onSuccess: async (data) => {
        await this.qc.invalidateQueries({
          queryKey: [TAGS.LIST_COMMUNITY_BENFICIARIES],
        });

        await this.qc.refetchQueries({
          queryKey: [TAGS.LIST_COMMUNITY_BENFICIARIES],
        });

        Swal.fire({
          icon: 'success',
          title: 'Bulk Beneficiary Created Successfully',
        });
      },
      onError: (error: any) => {
        Swal.fire({
          icon: 'error',
          title:
            error.message || 'Encounter error on Creating Benificiary Bulk',
        });
      },
    });
  };
}

import {
  QueryClient,
  useMutation,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { RumsanService } from '@rumsan/sdk';
import { TAGS } from '../config';

export class BeneficiaryQuery {
  private reactQueryClient: QueryClient;
  private client: RumsanService;

  constructor(client: RumsanService, reactQueryClient: QueryClient) {
    this.reactQueryClient = reactQueryClient;
    this.client = client;
  }

  async listBeneficiary(payload: any) {
    const searchParams = {
      page: 1,
      perPage: 10,
      sort: 'createdAt',
      order: 'desc',
    };
    const response = await this.client.client.get(`/beneficiaries`, {
      params: searchParams,
    });
    return response?.data;
  }

  useListBeneficiary = (payload: any): UseQueryResult<any, Error> => {
    return useQuery({
      queryKey: [TAGS.GET_BENEFICIARIES],
      queryFn: () => this.listBeneficiary(payload),
    });
  };

  async createBeneficiary(payload: any) {
    // console.log(payload);
    const response = await this.client.client.post('/beneficiaries', payload);
    return response?.data;
  }

  useCreateBeneficiary = () => {
    return useMutation({
      mutationFn: (payload: any) => this.createBeneficiary(payload),
      onSuccess: () => {
        this.reactQueryClient.invalidateQueries({
          queryKey: [TAGS.GET_BENEFICIARIES],
        });
      },
    });
  };

  async listBeneficiaryStatus() {
    const response = await this.client.client.get('/beneficiaries/stats');
    return response?.data;
  }

  useListBeneficiaryStatus = (): UseQueryResult<any, Error> => {
    return useQuery({
      queryKey: [TAGS.GET_BENEFICIARIES_STATUS],
      queryFn: () => this.listBeneficiaryStatus,
    });
  };

  async updateBeneficiary(payload: any) {
    const response = await this.client.client.patch(
      `/beneficiaries/${payload.uuid}`,
      payload
    );
    return response?.data;
  }
  useUpdateBeneficiary = (payload: any) => {
    return useMutation({
      mutationFn: (payload: any) => this.updateBeneficiary(payload),
      onSuccess: () => {
        this.reactQueryClient.invalidateQueries({
          queryKey: [TAGS.GET_BENEFICIARIES],
        });
      },
    });
  };

  async addBulkBeneficiary(payload: any[]) {
    const response = await this.client.client.post(
      '/beneficiaries/bulk',
      payload
    );
    return response?.data;
  }

  useAddBulkBeneficiary = () => {
    return useMutation({
      mutationFn: (payload: any[]) => this.addBulkBeneficiary(payload),
      onSuccess: () => {
        this.reactQueryClient.invalidateQueries({
          queryKey: [TAGS.GET_BENEFICIARIES],
        });
      },
    });
  };
  async uploadBeneficiaryFile(file: any) {
    const response = await this.client.client.post(
      '/beneficiaries/upload',
      file
    );
    return response?.data;
  }
  useUploadBeneficiaryFile = () => {
    return useMutation({
      mutationFn: (file: any) => this.uploadBeneficiaryFile(file),
      onSuccess: () => {
        this.reactQueryClient.invalidateQueries({
          queryKey: [TAGS.GET_BENEFICIARIES],
        });
      },
    });
  };
}

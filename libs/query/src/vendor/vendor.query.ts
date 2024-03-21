import { getVendorClient } from '@rahataid/sdk/clients';
import { VendorClient } from '@rahataid/sdk/types';
import { RumsanService } from '@rumsan/sdk';
import { QueryClient, useQuery, UseQueryResult } from '@tanstack/react-query';
import { TAGS } from '../config';
import { UUID } from 'crypto';

export class VendorQuery {
  private reactQueryClient: QueryClient;
  private client: VendorClient;

  constructor(rsService: RumsanService, reactQueryClient: QueryClient) {
    this.reactQueryClient = reactQueryClient;
    this.client = getVendorClient(rsService.client);
  }

  useVendorList = (payload: any): UseQueryResult<any, Error> => {
    const result = useQuery({
      queryKey: [TAGS.GET_VENDORS, payload],
      queryFn: () => this.client.list(payload),
    });

    const filteredData = result?.data?.map((row: any) => {
      return {
        id: row.User.uuid,
        status: 'pending',
        email: row.User.email,
        amount: 300,
      };
    })

    return filteredData;
  };

  useVendorDetails = (uuid:UUID): UseQueryResult<any,Error> =>{
    return useQuery({
      queryKey:[TAGS.GET_VENDOR_DETAILS,uuid],
      queryFn: () => this.client.get(uuid)
    })
  }
}

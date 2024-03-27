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
    return useQuery({
      queryKey: [TAGS.GET_VENDORS, payload],
      queryFn: async () => {
        const data = await this.client.list(payload);
        return {
          ...data,
          // TODO: remove type any
          data: data.data.map((d: any) => ({
            // TODO:Must include User in the Vendor Type ,use uuid key
            id: d.User.uuid,
            status: d?.User?.VendorProject[0]?.Project?.id
              ? 'Assigned'
              : 'Pending',
            email: d.User.email,
            projectName: d?.User?.VendorProject[0]?.Project?.name || 'N/A',
            walletAddress: d.User.wallet,
          })),
        };
      },
    });
  };

  useVendorDetails = (uuid: UUID): UseQueryResult<any, Error> => {
    return useQuery({
      queryKey: [TAGS.GET_VENDOR_DETAILS, uuid],
      queryFn: () => this.client.get(uuid),
    });
  };
}

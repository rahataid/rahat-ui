import { getProjectClient } from '@rahataid/sdk/clients';
import { ProjectClient } from '@rahataid/sdk/types';
import { RumsanService } from '@rumsan/sdk';
import { QueryClient, useQuery, UseQueryResult } from '@tanstack/react-query';
import { TAGS } from '../config';
import { UUID } from 'crypto';

export class VendorQuery {
  private reactQueryClient: QueryClient;
  private client: ProjectClient;

  constructor(rsService: RumsanService, reactQueryClient: QueryClient) {
    this.reactQueryClient = reactQueryClient;
    this.client = getProjectClient(rsService.client);
  }

  useProjectList = (payload: any): UseQueryResult<any, Error> => {
    return useQuery({
      queryKey: [TAGS.GET_ALL_PROJECTS, payload],
      queryFn: () => this.client.list(payload),
    });
  };

  useProjectDetails = (uuid: UUID): UseQueryResult<any, Error> => {
    return useQuery({
      queryKey: [TAGS.GET_PROJECT_DETAILS, uuid],
      queryFn: () => this.client.get(uuid),
    });
  };
}

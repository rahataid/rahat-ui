import { getProjectClient } from '@rahataid/sdk/clients';
import { useRSQuery } from '@rumsan/react-query';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { TAGS } from '../../config';
import { FormattedResponse } from '@rumsan/sdk/utils';

export interface SiteInfo {
  BRAND_LOGO: string;
  BRAND_NAME: string;
  BRAND_DESCRIPTION: string;
  SITE_BACKGROUND_IMAGE: string;
}
interface SiteInfoResponse {
  name: string;
  value: SiteInfo;
  dataType: string;
  requiredFields: string[];
  isReadOnly: boolean;
  isPrivate: boolean;
}
const BASE_URL = process.env['NEXT_PUBLIC_API_HOST_URL'] || '';
const fetchSiteInfo = async (): Promise<
  FormattedResponse<SiteInfoResponse>
> => {
  const response = await fetch(`${BASE_URL}/v1/app/settings/site-info`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch site info');
  }
  const data = await response.json();
  return data;
};

export const useSiteInfoList = (
  payload?: any,
): UseQueryResult<FormattedResponse<SiteInfoResponse>, Error> => {
  return useQuery({
    queryKey: [TAGS.GET_SITE_INFO, payload],
    queryFn: () => fetchSiteInfo(),
    staleTime: 5 * 60 * 60 * 1000, // 5 hours
    retryOnMount: true,
  });
};

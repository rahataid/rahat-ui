import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';
import { useRSQuery } from '@rumsan/react-query';
import { useTranslations } from 'next-intl';
import Swal from 'sweetalert2';
import { TAGS } from '../../config';
import { FormattedResponse } from '@rumsan/sdk/utils';
import { api } from '../../utils/api';
import { resolveBackendErrorMessage } from '../../utils/i18n/backend-error';
import { useUploadFile } from '../upload/upload.service';

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
const SITE_INFO_URL = 'app/settings/site-info';
const fetchSiteInfo = async (): Promise<
  FormattedResponse<SiteInfoResponse>
> => {
  const response = await api.get(SITE_INFO_URL);

  if (!response.data) {
    throw new Error('Failed to fetch site info');
  }
  const data = await response.data;
  return data;
};

export const useSiteInfoList = (): UseQueryResult<
  FormattedResponse<SiteInfoResponse>,
  Error
> => {
  return useQuery({
    queryKey: [TAGS.GET_SITE_INFO],
    queryFn: () => fetchSiteInfo(),
    staleTime: 60 * 60 * 1000, // 1 hour
    retryOnMount: true,
  });
};

const SITE_INFO_SETTING_NAME = 'SITE_SETTINGS';

export type UpdateSiteInfoInput = {
  original: SiteInfo;
  BRAND_NAME: string;
  BRAND_DESCRIPTION: string;
  logoFile?: File | null;
  backgroundFile?: File | null;
  logoRemoved?: boolean;
  backgroundRemoved?: boolean;
};

const uploadToMediaUrl = async (
  upload: (file: FormData) => Promise<any>,
  file: File,
) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await upload(formData);
  return res?.data?.mediaURL as string;
};

export const useUpdateSiteInfo = () => {
  const { queryClient } = useRSQuery();
  const t = useTranslations();
  const uploadFile = useUploadFile();

  return useMutation(
    {
      mutationKey: ['UPDATE_SITE_INFO'],
      mutationFn: async (input: UpdateSiteInfoInput) => {
        const {
          original,
          BRAND_NAME,
          BRAND_DESCRIPTION,
          logoFile,
          backgroundFile,
          logoRemoved,
          backgroundRemoved,
        } = input;

        // Upload only the images the user replaced; removed images are cleared
        let logoUrl = logoRemoved ? '' : original.BRAND_LOGO;
        let backgroundUrl = backgroundRemoved
          ? ''
          : original.SITE_BACKGROUND_IMAGE;
        if (logoFile)
          logoUrl = await uploadToMediaUrl(uploadFile.mutateAsync, logoFile);
        if (backgroundFile)
          backgroundUrl = await uploadToMediaUrl(
            uploadFile.mutateAsync,
            backgroundFile,
          );

        const response = await api.patch(SITE_INFO_URL, {
          name: SITE_INFO_SETTING_NAME,
          dataType: 'OBJECT',
          requiredFields: [],
          isReadOnly: false,
          isPrivate: false,
          value: {
            BRAND_NAME,
            BRAND_DESCRIPTION,
            BRAND_LOGO: logoUrl,
            SITE_BACKGROUND_IMAGE: backgroundUrl,
          },
        });
        return response?.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [TAGS.GET_SITE_INFO] });
        Swal.fire(
          t('GLOBAL.SETTINGS_UPDATED_SUCCESSFULLY' as never),
          '',
          'success',
        );
      },
      onError: (error: any) => {
        const rawMessage =
          error?.response?.data?.message ||
          t('GLOBAL.ERROR_ON_CREATING_DATA' as never);
        const errorMessage = resolveBackendErrorMessage(
          t,
          error?.response?.data?.code,
          error?.response?.data?.params,
          ['SETTINGS'],
          rawMessage,
        );
        Swal.fire(t('GLOBAL.ERROR' as never), errorMessage, 'error');
      },
    },
    queryClient,
  );
};

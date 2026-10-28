import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { api } from '../../utils/api';
import { resolveBackendErrorMessage } from '../../utils/i18n/backend-error';
import { showToast } from '../../utils/custom-toast';

const uploadFile = async (file: any) => {
  const response = await api.post('/upload/file', file);
  return response?.data;
};

export const useUploadFile = () => {
  const tg = useTranslations('GLOBAL');
  const tb = useTranslations();

  return useMutation({
    mutationFn: (file: any) => uploadFile(file),
    onError: (error: any) => {
      const rawMessage = error?.response?.data?.message || tg('ERROR');
      const errorMessage = resolveBackendErrorMessage(
        tb,
        error?.response?.data?.code,
        error?.response?.data?.params,
        ['BENEFICIARY_IMPORT_COMMUNITY_BENEFICIARY'],
        rawMessage,
      );
      showToast({
        type: 'error',
        title: tg('FILE_UPLOAD_FAILED'),
        description: errorMessage,
      });
    },
  });
};

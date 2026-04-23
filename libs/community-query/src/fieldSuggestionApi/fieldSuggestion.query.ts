import { useMutation } from '@tanstack/react-query';

import { getAiApi } from '@rahat-ui/query';

const uploadExcel = async ({
  payload,
  baseURL,
}: {
  payload: any;
  baseURL: string;
}) => {
  const aiApi = getAiApi(baseURL);
  const res = await aiApi.post('/api/csv/upload/', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};
const uploadStandardLevel = async ({
  payload,
  baseURL,
}: {
  payload: any;
  baseURL: string;
}) => {
  const aiApi = getAiApi(baseURL);
  const res = await aiApi.post('/api/json/standard/label', payload, {});
  return res.data;
};

export const useUploadCsvForMapping = () => {
  return useMutation({
    mutationFn: ({ payload, baseURL }: { payload: any; baseURL: string }) =>
      uploadExcel({ payload, baseURL }),
    onSuccess: () => {
      //qc.invalidateQueries({ queryKey: [TAGS.GET_ALL_PROJECTS] });
    },
  });
};

export const useUploadStandardLevel = () => {
  return useMutation({
    mutationFn: ({ payload, baseURL }: { payload: any; baseURL: string }) =>
      uploadStandardLevel({ payload, baseURL }),
    onSuccess: () => {
      //qc.invalidateQueries({ queryKey: [TAGS.GET_ALL_PROJECTS] });
    },
  });
};

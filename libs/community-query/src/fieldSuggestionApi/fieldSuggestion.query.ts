import { useMutation } from '@tanstack/react-query';

import { aiApi } from '@rahat-ui/query';

const uploadExcel = async (payload: any) => {
  const res = await aiApi.post('/api/csv/upload/', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};
const uploadStandardLevel = async (payload: any) => {
  const res = await aiApi.post('/api/json/standard/label', payload, {});
  return res.data;
};

export const useUploadCsvForMapping = () => {
  return useMutation({
    mutationFn: (payload: any) => uploadExcel(payload),
    onSuccess: () => {
      //qc.invalidateQueries({ queryKey: [TAGS.GET_ALL_PROJECTS] });
    },
  });
};

export const useUploadStandardLevel = () => {
  return useMutation({
    mutationFn: (payload: any) => uploadStandardLevel(payload),
    onSuccess: () => {
      //qc.invalidateQueries({ queryKey: [TAGS.GET_ALL_PROJECTS] });
    },
  });
};

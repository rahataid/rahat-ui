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
const uploadStandardJson = async ({
  payload,
  baseURL,
}: {
  payload: any;
  baseURL: string;
}) => {
  const aiApi = getAiApi(baseURL);
  const res = await aiApi.post('/api/json/standard/upload/', payload);
  return res.data;
};

const getStandardFields = async ({
  standardName,
  baseURL,
}: {
  standardName: string;
  baseURL: string;
}) => {
  const aiApi = getAiApi(baseURL);
  const res = await aiApi.get(`/api/json/standard/${standardName}/fields`);
  return res.data;
};
// to add labels to standard field name
const addStandardLabel = async ({
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
// to update labels to standard field name
export const useAddStandardLabel = () => {
  
  return useMutation({
    mutationFn: ({ payload, baseURL }: { payload: any; baseURL: string }) =>
      addStandardLabel({ payload, baseURL }),
    onSuccess: () => {
      //qc.invalidateQueries({ queryKey: [TAGS.GET_ALL_PROJECTS] });
    },
  });
};

export const useUploadStandardJson = () => {
  return useMutation({
    mutationFn: ({ payload, baseURL }: { payload: any; baseURL: string }) =>
      uploadStandardJson({ payload, baseURL }),
  });
};

export const useGetStandardFields = () => {
  return useMutation({
    mutationFn: ({
      standardName,
      baseURL,
    }: {
      standardName: string;
      baseURL: string;
    }) => getStandardFields({ standardName, baseURL }),
  });
};




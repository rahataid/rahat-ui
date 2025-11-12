import { useMutation, useQuery } from '@tanstack/react-query';

import Swal from 'sweetalert2';
import { aiApi } from '@rahat-ui/query';

const uploadExcel = async (payload: any) => {
  const res = await aiApi.post('/api/csv/upload', payload, {
    params: {
      processing_mode: 'fast',
    },
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

const getMappingSuggestions = async (datasetId: string) => {
  const res = await aiApi.get(`/api/csv/mappings-simple/${datasetId}`);
  return res.data;
};

export const useUploadCsvForMapping = () => {
  //const qc = useQueryClient();
  //need to provide type
  return useMutation({
    mutationFn: (payload: any) => uploadExcel(payload),
    onSuccess: () => {
      //qc.invalidateQueries({ queryKey: [TAGS.GET_ALL_PROJECTS] });
    },
  });
};

export const useGetAiMappingSuggestions = () => {
  return useMutation({
    mutationFn: (datasetId: string) => getMappingSuggestions(datasetId),
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message || 'Failed to get AI mapping suggestions!';
      Swal.fire({
        icon: 'error',
        title: msg,
      });
    },
  });
};

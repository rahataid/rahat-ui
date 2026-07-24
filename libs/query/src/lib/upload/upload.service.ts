import { useMutation } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { useSwal } from 'libs/query/src/swal';

type UploadFileVariables = {
  file: File;
  onProgress?: (progress: number) => void;
  query?: {
    withFileName?: boolean | string;
    folderName?: string;
    rootFolderName?: string;
  };
};

const uploadFile = async (variables: UploadFileVariables | File) => {
  const file = variables instanceof File ? variables : variables.file;
  const onProgress =
    variables instanceof File ? undefined : variables.onProgress;
  const query = variables instanceof File ? undefined : variables.query;
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload/file', formData, {
    params: query,
    onUploadProgress: (progressEvent) => {
      if (!onProgress || !progressEvent.total) return;

      const progress = Math.round(
        (progressEvent.loaded / progressEvent.total) * 100,
      );
      onProgress(Math.min(100, Math.max(0, progress)));
    },
  });

  return response?.data;
};

export const useUploadFile = () => {
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: (variables: UploadFileVariables | File) =>
      uploadFile(variables),
    // onSuccess: () => {
    //     toast.fire({
    //         title: 'File upload success',
    //         icon: 'success',
    //     })
    // },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      toast.fire({
        title: 'File upload failed.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

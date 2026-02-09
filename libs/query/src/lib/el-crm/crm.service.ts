import { useMutation } from '@tanstack/react-query';
import { useSwal } from '../../swal';
import { UUID } from 'crypto';
import { useRSQuery } from '@rumsan/react-query';

export const useUploadCustomers = () => {
  const { rumsanService } = useRSQuery();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({
      projectId,
      selectedFile,
      doctype,
    }: {
      projectId: UUID;
      selectedFile: File;
      doctype: string;
    }) => {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('doctype', doctype);
      formData.append('projectId', projectId);
      const res = await rumsanService.client.post('/vendors/upload', formData);
      return res?.data;
    },
    onSuccess: () => {
      toast.fire({
        title: 'Customers upload in progress',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      toast.fire({
        title: 'Error while uploading customers.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

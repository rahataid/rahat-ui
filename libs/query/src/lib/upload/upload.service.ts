import { useMutation } from "@tanstack/react-query";
import { api } from "../../utils/api";
import { useSwal } from 'libs/query/src/swal';

const uploadFile = async (file: any) => {
    const response = await api.post('/upload/file', file);
    return response?.data;
}

export const useUploadFile = () => {
    const alert = useSwal();
    const toast = alert.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
    });
    return useMutation({
        mutationFn: (file: any) => uploadFile(file),
        onSuccess: () => {
            toast.fire({
                title: 'File upload success',
                icon: 'success',
            })
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Error';
            toast.fire({
                title: 'File upload failed.',
                icon: 'error',
                text: errorMessage,
            });
        }
    })
}
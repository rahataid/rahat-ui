import { useSwal } from '@rahat-ui/query/swal';
import { api } from '@rahat-ui/query/utils/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const fetchJobs = async (endpoint: string, filters = {}) => {
  const { data } = await api.get(`/queue/${endpoint}`, {
    params: filters,
  });
  return data?.data;
};

export const retryJob = async (endpoint: string, jobId: number | string) => {
  const { data } = await api.get(`/queue/${endpoint}/retry/${jobId}`);
  return data;
};

export const useQueueJobsQuery = (queueType: string, filters: any) => {
  return useQuery({
    queryKey: ['jobs', queueType, filters],
    queryFn: () => fetchJobs(queueType, filters),
    refetchInterval(query) {
      return 2000;
    },
  });
};

export const useRetryJobMutation = (queueType: string) => {
  const queryClient = useQueryClient();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-right',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
  return useMutation({
    mutationFn: (jobId: number | string) => retryJob(queueType, jobId),
    onError(error, variables, context) {
      console.log('error', error);
      toast.fire({
        icon: 'error',
        title: (error as any)?.response?.data?.message || 'An error occurred',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs', queueType] });
      toast.fire({
        icon: 'success',
        title: 'Job has been retried successfully',
      });
    },
  });
};

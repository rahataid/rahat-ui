import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { toast } from 'sonner';
import { useProjectAction } from '../../projects';

export const useAAProjectSettingsList = (projectUUID: UUID) => {
  const q = useProjectAction<any>();
  return useQuery({
    queryKey: ['aa.settings.list', projectUUID],
    enabled: !!projectUUID,
    refetchOnMount: true,
    queryFn: async () => {
      const res = await q.mutateAsync({
        uuid: projectUUID,
        data: { action: 'settings.list', payload: {} },
      });
      return res.data;
    },
  });
};

export const useAAProjectSettingsAdd = () => {
  const q = useProjectAction<any>();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      projectUUID,
      dto,
    }: {
      projectUUID: UUID;
      dto: any;
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: { action: 'settings.add', payload: dto },
      });
    },
    onSuccess: (_, { projectUUID }) => {
      queryClient.invalidateQueries({
        queryKey: ['aa.settings.list', projectUUID],
      });
      toast.success('Setting added successfully');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Failed to add setting',
      );
    },
  });
};

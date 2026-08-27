import { UUID } from 'crypto';
import { useProjectAction } from '../../projects';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSwal } from 'libs/query/src/swal';

function useToast() {
  const alert = useSwal();
  return alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
}
export const useGetBeneficiariesQr = (payload: {
  projectUuid: UUID;
  groupId: UUID;
  isSuccess?: boolean;
}) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['beneficiariesQr', payload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: payload.projectUuid,
        data: {
          action: 'aaProject.beneficiary.getQrPdf',
          payload: {
            groupId: payload.groupId,
          },
        },
      });
      return mutate.data;
    },
    // keepPreviousData: true,
    enabled: !!payload.projectUuid && !!payload.groupId,
    staleTime: 1000,
    refetchInterval: (query) => {
      const data = query.state.data as { status?: string } | null;
      if (data?.status === 'processing') return 3000;
      return false;
    },
  });

  return query;
};

const SPONSORSHIP_POLL_INTERVAL = 5000;
const SPONSORSHIP_POLL_TIMEOUT = 2 * 60 * 1000;
// ponytail: module-level map (not component state) since refetchInterval runs outside React render
const sponsorshipPollStartedAt = new Map<string, number>();

export const useGetSponsorshipStatusForGroup = (payload: {
  projectUuid: UUID;
  groupUuid: UUID;
}) => {
  const q = useProjectAction();

  return useQuery({
    queryKey: ['sponsorshipStatus', payload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: payload.projectUuid,
        data: {
          action: 'aaProject.beneficiary.getSponsorshipStatusForGroup',
          payload: {
            groupUuid: payload.groupUuid,
          },
        },
      });
      return mutate.data;
    },
    enabled: !!payload.projectUuid && !!payload.groupUuid,
    staleTime: 1000,
    refetchInterval: (query) => {
      const data = query.state.data as {
        isStellarChain?: boolean;
        pending?: number;
      } | null;
      if (!data?.isStellarChain || !data.pending) {
        sponsorshipPollStartedAt.delete(payload.groupUuid);
        return false;
      }
      const startedAt = sponsorshipPollStartedAt.get(payload.groupUuid);
      if (startedAt === undefined) {
        sponsorshipPollStartedAt.set(payload.groupUuid, Date.now());
        return SPONSORSHIP_POLL_INTERVAL;
      }
      // ponytail: stop polling after 2min so a stuck pending count doesn't poll forever
      if (Date.now() - startedAt > SPONSORSHIP_POLL_TIMEOUT) return false;
      return SPONSORSHIP_POLL_INTERVAL;
    },
    refetchIntervalInBackground: false,
  });
};

export const useRetrySponsorshipForGroup = (projectUuid: UUID) => {
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (groupUuid: UUID) => {
      const mutate = await q.mutateAsync({
        uuid: projectUuid,
        data: {
          action: 'aaProject.beneficiary.retrySponsorshipForGroup',
          payload: { groupUuid },
        },
      });
      return mutate.data;
    },
    onSuccess: (_, groupUuid) => {
      sponsorshipPollStartedAt.delete(groupUuid);
      queryClient.invalidateQueries({
        queryKey: ['sponsorshipStatus', { projectUuid, groupUuid }],
      });
    },
    onError: (error) => {
      toast.fire({
        title: error?.message || 'Failed to retry sponsorship',
        icon: 'error',
      });
    },
  });
};

export const useGenerateQrPdf = (projectUuid: UUID) => {
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (groupId: UUID) => {
      const mutate = await q.mutateAsync({
        uuid: projectUuid,
        data: {
          action: 'aaProject.beneficiary.generateQrPdf',
          payload: {
            groupId: groupId,
          },
        },
      });
      return mutate.data;
    },
    onSuccess: (_, groupId) => {
      queryClient.invalidateQueries({
        queryKey: ['beneficiariesQr', { projectUuid, groupId }],
      });
      toast.fire({
        title: 'QR generated successfully',
        icon: 'success',
      });
    },
    onError: (error) => {
      toast.fire({
        title: error?.message || 'Failed to generate QR PDF',
        icon: 'error',
      });
    },
  });
};

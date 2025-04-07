'use client';
import { useEffect } from 'react';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useProjectAction } from '../../projects';
import {
  useStakeholdersGroupsStore,
  useBeneficiariesGroupStore,
} from './groups.store';
import { UUID } from 'crypto';
import { useSwal } from 'libs/query/src/swal';

export const useCreateStakeholdersGroups = () => {
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({
      projectUUID,
      stakeholdersGroupPayload,
    }: {
      projectUUID: UUID;
      stakeholdersGroupPayload: {
        name: string;
        stakeholders: Array<{
          uuid: string;
        }>;
      };
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aaProject.stakeholders.addGroup',
          payload: stakeholdersGroupPayload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      toast.fire({
        title: 'Stakeholders Group added successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while adding stakeholders group.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useCreateBenficiariesGroups = () => {
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({
      projectUUID,
      beneficiariesGroupPayload,
    }: {
      projectUUID: UUID;
      beneficiariesGroupPayload: {
        name: string;
        beneficiaries: Array<{
          uuid: string;
        }>;
      };
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aaProject.beneficiary.addGroup',
          payload: beneficiariesGroupPayload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      toast.fire({
        title: 'Beneficiaries Group added successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while adding stakeholders group.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useReserveTokenForGroups = () => {
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({
      projectUUID,
      reserveTokenPayload,
    }: {
      projectUUID: UUID;
      reserveTokenPayload: {
        beneficiaryGroupId: string;
        numberOfTokens: number;
        totalTokensReserved: number;
        title: string;
      };
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aaProject.beneficiary.reserve_token_to_group',
          payload: reserveTokenPayload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      toast.fire({
        title: 'Token reserve added successfully.',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while reserving tokens.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useStakeholdersGroups = (uuid: UUID, payload: any) => {
  const q = useProjectAction();
  const { setStakeholdersGroups, setStakeholdersGroupsMeta } =
    useStakeholdersGroupsStore((state) => ({
      setStakeholdersGroups: state.setStakeholdersGroups,
      setStakeholdersGroupsMeta: state.setStakeholdersGroupsMeta,
    }));

  const query = useQuery({
    queryKey: ['stakeholdersGroups', uuid, payload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aaProject.stakeholders.getAllGroups',
          payload: payload,
        },
      });
      return mutate.response;
    },
  });

  useEffect(() => {
    if (query?.data) {
      setStakeholdersGroups(query?.data?.data);
      setStakeholdersGroupsMeta(query?.data?.meta);
    }
  }, [query.data]);

  return { ...query, stakeholdersGroupsMeta: query?.data?.meta };
};

export const useSingleStakeholdersGroup = (
  uuid: UUID,
  stakeholdersGroupId: UUID,
) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['stakeholdersGroup', uuid, stakeholdersGroupId],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aaProject.stakeholders.getOneGroup',
          payload: {
            uuid: stakeholdersGroupId,
          },
        },
      });
      return mutate.data;
    },
  });
  return query;
};

export const useSingleBeneficiaryGroup = (
  uuid: UUID,
  beneficiariesGroupID: UUID,
) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['beneficiaryGroup', uuid, beneficiariesGroupID],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aaProject.beneficiary.getOneGroup',
          payload: {
            uuid: beneficiariesGroupID,
          },
        },
      });
      return mutate.data;
    },
  });
  return query;
};

export const useBeneficiariesGroups = (uuid: UUID, payload: any) => {
  const q = useProjectAction();
  const { setBeneficiariesGroups, setBeneficiariesGroupsMeta } =
    useBeneficiariesGroupStore((state) => ({
      setBeneficiariesGroups: state.setBeneficiariesGroup,
      setBeneficiariesGroupsMeta: state.setBeneficiariesGroupMeta,
    }));

  const query = useQuery({
    queryKey: ['beneficiaryGroups', uuid, payload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aaProject.beneficiary.getAllGroups',
          payload: payload,
        },
      });
      return mutate.response;
    },
  });

  useEffect(() => {
    if (query?.data) {
      const benfGroupsFormatted = query?.data?.data?.map((d: any) => {
        return {
          ...d,
          // members: d?.groupedBeneficiaries?.map((m: any) => {
          //   return m?.Beneficiary
          // })
        };
      });

      // setBeneficiariesGroups(query?.data?.data);
      setBeneficiariesGroups(benfGroupsFormatted);
      setBeneficiariesGroupsMeta(query?.data?.meta);
    }
  }, [query.data]);

  return { ...query, stakeholdersGroupsMeta: query?.data?.meta };
};

export const useUpdateStakeholdersGroups = () => {
  const qc = useQueryClient();
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({
      projectUUID,
      stakeholdersGroupPayload,
    }: {
      projectUUID: UUID;
      stakeholdersGroupPayload: {
        uuid: string;
        name?: string;
        stakeholders?: Array<{
          uuid: string;
        }>;
      };
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aaProject.stakeholders.updateGroup',
          payload: stakeholdersGroupPayload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({
        queryKey: ['stakeholdersGroups', 'stakeholders'],
      });
      toast.fire({
        title: 'Stakeholders group updated successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while updating stakeholders group.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useDeleteStakeholdersGroups = () => {
  const qc = useQueryClient();
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({
      projectUUID,
      stakeholdersGroupPayload,
    }: {
      projectUUID: UUID;
      stakeholdersGroupPayload: {
        uuid: string;
      };
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aaProject.stakeholders.deleteGroup',
          payload: stakeholdersGroupPayload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({
        queryKey: ['stakeholdersGroups', 'stakeholders'],
      });
      toast.fire({
        title: 'Stakeholders Group removed successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while removing stakeholders group.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useGroupsReservedFunds = (uuid: UUID, payload: any) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['groupsreservedfunds', uuid, payload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aaProject.beneficiary.get_all_token_reservation',
          payload: payload,
        },
      });
      return mutate;
    },
  });

  return query;
};

export const useSingleGroupReservedFunds = (
  uuid: UUID,
  fundId: string | string[],
) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['fundmanagement', uuid, fundId],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aaProject.beneficiary.get_one_token_reservation',
          payload: {
            uuid: fundId,
          },
        },
      });

      return mutate.data;
    },
  });
  return query;
};

export const useReservationStats = (uuid: UUID) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['reservationstats', uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aaProject.beneficiary.get_reservation_stats',
          payload: {},
        },
      });
      return mutate;
    },
  });
  return query;
};

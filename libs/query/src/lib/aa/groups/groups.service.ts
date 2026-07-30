'use client';
import { useEffect } from 'react';
import {
  keepPreviousData,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  UseQueryOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { useProjectAction } from '../../projects';
import {
  useStakeholdersGroupsStore,
  useBeneficiariesGroupStore,
} from './groups.store';
import { UUID } from 'crypto';
import { useSwal } from 'libs/query/src/swal';
import { useBeneficiaryGroupsStore } from '../../beneficiary/beneficiary-groups.store';
import { BeneficiaryGroupListItem } from '@rahat-ui/types';
import { useTranslations } from 'next-intl';

type StakeholderGroupArgs = {
  projectUUID: UUID;
  stakeholdersGroupPayload: {
    name: string;
    stakeholders: Array<{
      uuid: string;
    }>;
  };
};

export const useCreateStakeholdersGroups = <
  TData = unknown,
  TError = unknown,
  TContext = unknown,
>(
  options?: Omit<
    UseMutationOptions<TData, TError, StakeholderGroupArgs, TContext>,
    'mutationFn'
  >,
): UseMutationResult<TData, TError, StakeholderGroupArgs, TContext> => {
  const t = useTranslations('AA_PROJECT');
  const qc = useQueryClient();
  const q = useProjectAction();
  const alert = useSwal();

  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });

  const mutationResults = useMutation<
    TData,
    TError,
    StakeholderGroupArgs,
    TContext
  >({
    mutationFn: async ({ projectUUID, stakeholdersGroupPayload }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aaProject.stakeholders.addGroup',
          payload: stakeholdersGroupPayload,
        },
      }) as TData;
    },
    onSuccess: async (data, variables, ctx) => {
      q.reset();
      await qc.invalidateQueries({
        queryKey: ['stakeholdersGroups'],
      });
      options?.onSuccess?.(data, variables, ctx);
      toast.fire({
        title: t('STAKEHOLDERS_GROUP_ADDED_SUCCESSFULLY'),
        icon: 'success',
      });
    },
    onError: (error, variables, ctx) => {
      q.reset();
      options?.onError?.(error, variables, ctx);
      const errorMessage = (error as any)?.response?.data?.message || t('ERROR');
      toast.fire({
        title: t('ERROR_WHILE_ADDING_STAKEHOLDERS_GROUP'),
        icon: 'error',
        text: errorMessage,
      });
    },
    ...options,
  });

  return {
    ...mutationResults,
    mutate: (variables: StakeholderGroupArgs) => {
      if (!mutationResults.isPending) {
        mutationResults.mutate(variables);
      }
    },
  };
};
export const useCreateBenficiariesGroups = () => {
  const t = useTranslations('AA_PROJECT');
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
        title: t('BENEFICIARIES_GROUP_ADDED_SUCCESSFULLY'),
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || t('ERROR');
      q.reset();
      toast.fire({
        title: t('ERROR_WHILE_ADDING_BENEFICIARIES_GROUP'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useReserveTokenForGroups = () => {
  const t = useTranslations('AA_PROJECT');
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
        isPayoutIntegrated?: boolean;
        params?: {
          type: string;
          mode: string;
          payoutProcessorId?: string;
          extras?: Record<string, string | undefined>;
        };
      };
    }) => {
      const response = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aaProject.beneficiary.reserve_token_to_group',
          payload: reserveTokenPayload,
        },
      });
      return response?.data;
    },
    onSuccess: (data: any) => {
      q.reset();
      if (data?.status === 'error') return;
      toast.fire({
        title: t('TOKEN_RESERVE_ADDED_SUCCESSFULLY'),
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || t('ERROR');
      q.reset();
      toast.fire({
        title: t('ERROR_WHILE_RESERVING_TOKENS'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useValidateTokenAssignment = () => {
  const q = useProjectAction();
  return useMutation({
    mutationFn: async ({
      projectUUID,
      groupId,
    }: {
      projectUUID: UUID;
      groupId: string;
    }) => {
      const response = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aaProject.beneficiary.validate_token_assignment',
          payload: { groupId },
        },
      });
      return response?.data;
    },
    onSuccess: () => {
      q.reset();
    },
    onError: (error: any) => {
      q.reset();
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
    staleTime: 20 * 60 * 1000, // 20 minutes
  });

  useEffect(() => {
    if (query?.data) {
      setStakeholdersGroups(query?.data?.data);
      setStakeholdersGroupsMeta(query?.data?.meta);
    }
  }, [query.data]);

  return { ...query, stakeholdersGroupsMeta: query?.data?.meta };
};

export const useBeneficiaryGroups = (uuid: UUID, payload: any, options?: Omit<UseQueryOptions, 'queryKey' | 'queryFn'>) => {
  const q = useProjectAction();
  const { setBeneficiaryGroups } = useBeneficiaryGroupsStore((state) => ({
    setBeneficiaryGroups: state.setBeneficiaryGroups,
  }));

  const query = useQuery<any>({
    queryKey: ['stakeholdersGroups', uuid, payload],
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
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
      setBeneficiaryGroups(query?.data?.data);
    }
  }, [query.data]);

  const groups: BeneficiaryGroupListItem[] = query.data?.data ?? [];
  const meta = query.data?.meta;

  return { ...query, data: groups, meta };
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
    enabled: !!stakeholdersGroupId,
  });
  return query;
};

export const useStakeholdersGroupByUuids = (
  uuid: UUID,
  stakeholdersGroupUuids: string[],
  queryValidation: boolean,
) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['stakeholdersGroupDetailsByUuids', uuid, stakeholdersGroupUuids],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aaProject.stakeholders.getGroupDetailsByUuids',
          payload: {
            uuids: stakeholdersGroupUuids,
          },
        },
      });
      return mutate.data;
    },
    enabled: queryValidation,
    staleTime: 10 * 60 * 1000, // 10 minutes
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
    enabled: !!beneficiariesGroupID,
  });
  return query;
};

export const useBeneficiariesGroups = (
  uuid: UUID,
  payload: any,
  options?: { staleTime?: number },
) => {
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
    staleTime: options?.staleTime ?? 20 * 60 * 1000, // default 20 minutes
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
  const t = useTranslations('AA_PROJECT');
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
    onSuccess: async (_, variables) => {
      q.reset();
      await qc.invalidateQueries({
        queryKey: ['stakeholdersGroups'],
      });
      await qc.invalidateQueries({
        queryKey: ['stakeholdersGroup'],
      });
      qc.invalidateQueries({
        queryKey: [
          'stakeholdersGroup',
          variables.projectUUID,
          variables.stakeholdersGroupPayload.uuid,
        ],
      });
      toast.fire({
        title: t('STAKEHOLDERS_GROUP_UPDATED_SUCCESSFULLY'),
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || t('ERROR');
      q.reset();
      toast.fire({
        title: t('ERROR_WHILE_UPDATING_STAKEHOLDERS_GROUP'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useDeleteStakeholdersGroups = () => {
  const t = useTranslations('AA_PROJECT');
  const qc = useQueryClient();
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
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
      const response = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aaProject.stakeholders.deleteGroup',
          payload: stakeholdersGroupPayload,
        },
      });
      // return the full response so component can check isSuccess and activities
      return response?.data || response;
    },
    onSuccess: (data) => {
      // only show success toast if isSuccess is not false
      if (data?.isSuccess === true) {
        q.reset();
        qc.invalidateQueries({
          queryKey: ['stakeholdersGroups', 'stakeholders'],
        });
        toast.fire({
          title: t('STAKEHOLDERS_GROUP_REMOVED_SUCCESSFULLY'),
          icon: 'success',
        });
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || t('ERROR');
      q.reset();
      toast.fire({
        title: t('ERROR_WHILE_REMOVING_STAKEHOLDERS_GROUP'),
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

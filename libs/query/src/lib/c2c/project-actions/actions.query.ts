import { useMutation, useQuery } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { PROJECT_SETTINGS_KEYS } from '../../../config';
import { useProjectAction, useProjectSettingsStore } from '../../projects';
import { Pagination } from '@rumsan/sdk/types';
import { Beneficiary } from '@rahataid/sdk';
import Swal from 'sweetalert2';
import { formatEther } from 'viem';
import { useSwal } from 'libs/query/src/swal';
import axios from 'axios';

export const useGetTreasurySourcesSettings = (uuid: UUID) => {
  const projectActions = useProjectAction([
    'c2c',
    'treasurySourcesSettings-actions',
  ]);
  const { setSettings, settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
    setSettings: state.setSettings,
  }));

  const query = useQuery({
    queryKey: [
      'get-treasury-sources-settings',
      uuid,
      PROJECT_SETTINGS_KEYS.TREASURY_SOURCES,
    ],
    // enabled: isEmpty(
    //   settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.TREASURY_SOURCES],
    // ),
    queryFn: async () => {
      const response = await projectActions.mutateAsync({
        uuid,
        data: {
          action: 'settings.get',
          payload: {
            name: PROJECT_SETTINGS_KEYS.TREASURY_SOURCES,
          },
        },
      });
      return response.data.value;
    },
  });

  //   useEffect(() => {
  //     if (query.isSuccess) {
  //       const settingsToUpdate = {
  //         ...settings,
  //         [uuid]: {
  //           ...settings?.[uuid],
  //           [PROJECT_SETTINGS_KEYS.TREASURY_SOURCES]: query?.data,
  //         },
  //       };
  //       setSettings(settingsToUpdate);
  //       // setSettings({
  //       //   [uuid]: {
  //       //     [PROJECT_SETTINGS_KEYS.CONTRACT]: query?.data,
  //       //   },
  //       // });
  //     }
  //   }, [query.data]);

  return query;
};

type DisbursementListHookParams = {
  projectUUID: UUID;
  status: string;
  disbursementType: string;
  fromDate: string;
  toDate: string;
} & Pagination;

export const useGetDisbursements = (params: DisbursementListHookParams) => {
  const projectActions = useProjectAction(['c2c', 'disbursements-actions']);
  const { projectUUID, ...restParams } = params;

  const query = useQuery({
    queryKey: ['get-disbursements', params],
    queryFn: async () => {
      const response = await projectActions.mutateAsync({
        uuid: projectUUID,
        data: {
          // TODO: use dynamically from MS_ACTIONS
          action: 'c2cProject.disbursements.get',
          payload: restParams,
        },
      });
      return response.data;
    },
  });

  return query;
};

export const usePendingDisbursements = (projectUUID: UUID) => {
  const projectActions = useProjectAction(['c2c', 'disbursements-actions']);

  const query = useQuery({
    queryKey: ['get-pending-disbursements', projectUUID],
    queryFn: async () => {
      const response = await projectActions.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aidlink.disbursements.pending.get',
          payload: {},
        },
      });
      return response.data;
    },
  });

  return query;
};

export const useGetDisbursement = (
  projectUUID: UUID,
  disbursementUUID: UUID,
) => {
  const projectActions = useProjectAction(['c2c', 'disbursements-actions']);

  const query = useQuery({
    queryKey: ['get-disbursement', disbursementUUID],
    queryFn: async () => {
      const response = await projectActions.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'c2cProject.disbursement.getOne',
          payload: {
            disbursementUUID: disbursementUUID,
          },
        },
      });
      return response.data;
    },
  });

  return query;
};

export const useGetProjectReporting = (projectUUID: UUID) => {
  const projectActions = useProjectAction(['c2c', 'disbursements-actions']);

  const query = useQuery({
    queryKey: ['get-project-reporting', projectUUID],
    queryFn: async () => {
      const response = await projectActions.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'c2cProject.reporting.list',
          payload: {},
        },
      });
      return response.data;
    },
  });

  return query;
};

export const useGetDisbursementSafeChart = (projectUUID: UUID) => {
  const projectActions = useProjectAction(['c2c', 'disbursements-actions']);

  const query = useQuery({
    queryKey: ['get-disbursement-safe-chart', projectUUID],
    queryFn: async () => {
      const response = await projectActions.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aidlink.getDisbursementSafeChart',
          payload: {},
        },
      });
      return response.data;
    },
  });

  return query;
};

type DisbursementTransactionHookParams = {
  projectUUID: UUID;
  disbursementUUID: UUID;
} & Pagination;

export const useGetDisbursementTransactions = (
  params: DisbursementTransactionHookParams,
) => {
  const projectActions = useProjectAction(['c2c', 'disbursements-actions']);
  const { projectUUID, disbursementUUID, ...restParams } = params;

  const query = useQuery({
    queryKey: ['get-disbursement-transactions', disbursementUUID],
    queryFn: async () => {
      const response = await projectActions.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'c2cProject.disbursement.transactions.get',
          payload: {
            disbursementUUID: disbursementUUID,
            ...restParams,
          },
        },
      });
      return response.data;
    },
  });

  return query;
};

export const useGetBeneficiariesReport = () => {
  const projectActions = useProjectAction(['c2c', 'disbursements-actions']);
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
      fromDate,
      toDate,
    }: {
      projectUUID: UUID;
      fromDate: string;
      toDate: string;
    }) => {
      const response = await projectActions.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aidlink.getBenReportingLogs',
          payload: {
            fromDate,
            toDate,
          },
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.length === 0) {
        toast.fire({
          title: 'No Beneficiary record found.',
          text: 'Please try selecting a different date range.',
          icon: 'error',
        });
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || 'An error occured!';
      toast.fire({
        title: 'Error while getting report.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useGetBenefDisbursementDetails = (
  projectUUID: UUID,
  userUuid: string,
) => {
  const projectActions = useProjectAction(['c2c', 'disbursements-actions']);

  const query = useQuery({
    queryKey: ['get-benf-disbursement-details', projectUUID, userUuid],
    queryFn: async () => {
      const response = await projectActions.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aidlink.getBenDisbursementDetails',
          payload: {
            beneficiaryId: userUuid,
          },
        },
      });
      return response.data;
    },
  });

  return query;
};

export const useGetOfframpDetails = (
  projectUUID: UUID,
  beneficiaryPhone: string,
) => {
  const projectActions = useProjectAction(['c2c', 'disbursements-actions']);

  const query = useQuery({
    queryKey: ['get-getOfframpDetails', projectUUID, beneficiaryPhone],
    queryFn: async () => {
      const response = await projectActions.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aidlink.getOfframpDetails',
          payload: {
            beneficiaryPhone,
            limit: 100,
          },
        },
      });
      return response.data;
    },
  });

  return query;
};

export const useGetSafePending = (projectUUID: UUID) => {
  const projectActions = useProjectAction(['c2c', 'disbursements-actions']);

  const query = useQuery({
    queryKey: ['get-getSafePending', projectUUID],
    queryFn: async () => {
      const response = await projectActions.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'c2cProject.getSafePending',
          payload: {},
        },
      });
      return response.data;
    },
  });

  return query;
};

type DisbursementApprovalsHookParams = {
  projectUUID: UUID;
  disbursementUUID: UUID;
  transactionHash: string;
} & Pagination;

export const useGetDisbursementApprovals = (
  params: DisbursementApprovalsHookParams,
) => {
  const projectActions = useProjectAction([
    'c2c',
    'disbursements-actions-approvals',
  ]);
  const { projectUUID, disbursementUUID, transactionHash, ...restParams } =
    params;

  const query = useQuery({
    queryKey: ['get-disbursement-approvals', disbursementUUID],
    queryFn: async () => {
      const response = await projectActions.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'c2cProject.getSafeTransaction',
          payload: {
            projectUUID: projectUUID,
            transactionHash,
            ...restParams,
          },
        },
      });
      return response.data;
    },
    enabled: !!transactionHash,
  });

  return query;
};

export type Disbursement = {
  id: number;
  uuid: string;
  DisbursementBeneficiary: DisbursementBeneficiary[];
  type: DisbursementType;
  status: DisbursementStatus;
  timestamp?: string;
  amount?: number;
  transactionHash?: string;
  extras?: any;
  createdAt: Date;
  updatedAt?: Date;
};

export type DisbursementBeneficiary = {
  id: number;
  disbursementId: number;
  beneficiaryId: number;
  Disbursement: Disbursement;
  Beneficiary: Beneficiary;
  from?: string;
  amount?: number;
  transactionHash?: string;
  extras?: any;
  createdAt: Date;
  updatedAt?: Date;
};

export enum DisbursementType {
  PROJECT = 'PROJECT',
  EOA = 'EOA',
  MULTISIG = 'MULTISIG',
}

export enum DisbursementStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

export enum DisbursementSelectionType {
  INDIVIDUAL = 'INDIVIDUAL',
  GROUP = 'GROUP',
}

export const useAddDisbursement = () => {
  const projectActions = useProjectAction(['c2c', 'disbursements-actions']);

  return useMutation({
    mutationKey: ['add-disbursement'],
    onSuccess(data, variables, context) {
      Swal.fire({
        title: 'Disbursement Created',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError(error, variables, context) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        showConfirmButton: false,
        timer: 1500,
      });
    },
    mutationFn: async (data: {
      projectUUID: UUID;
      type: DisbursementType;
      disbursementType: DisbursementSelectionType;
      amount: string;
      beneficiaries?: any;
      beneficiaryGroup?: UUID;
      transactionHash: string;
      from: string;
      timestamp: string;
      status?: DisbursementStatus;
      details?: string;
    }) => {
      const { projectUUID, beneficiaries, beneficiaryGroup, ...restData } =
        data;
      const payload = {
        ...restData,
        ...(restData.disbursementType ===
          DisbursementSelectionType.INDIVIDUAL && {
          beneficiaries: beneficiaries.map((ben: any) => ({
            walletAddress: ben,
            from: restData.from,
            transactionHash: restData.transactionHash,
            amount: restData.amount,
          })),
        }),
        ...(restData.disbursementType === DisbursementSelectionType.GROUP && {
          beneficiaryGroup,
        }),
      };
      const response = await projectActions.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'c2cProject.disbursement.create',
          payload,
        },
      });
      return response.data;
    },
  });
};

export const useUpdateDisbursement = (projectUUID: UUID) => {
  const projectActions = useProjectAction(['c2c', 'disbursements-actions']);

  return useMutation({
    mutationKey: ['update-disbursement'],
    mutationFn: async (data: {
      type: DisbursementType;
      amount: number;
      beneficiaries: `0x{string}`[];
      transactionHash: string;
      from: string;
      timestamp: string;
    }) => {
      const response = await projectActions.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'c2cProject.disbursement.update',
          payload: data,
        },
      });
      return response.data;
    },
  });
};

export const useDisburseTokenUsingMultisig = () => {
  const projectActions = useProjectAction(['c2c', 'disbursements-actions']);
  const addDisbursement = useAddDisbursement();

  return useMutation({
    mutationKey: ['disburse-token-using-multisig'],
    mutationFn: async ({
      amount,
      projectUUID,
      disbursementType,
      beneficiaryAddresses,
      beneficiaryGroup,
      totalAmount,
      details,
    }: {
      amount: string;
      projectUUID: UUID;
      disbursementType: DisbursementSelectionType;
      beneficiaryAddresses?: `0x${string}`[];
      beneficiaryGroup?: UUID;
      totalAmount?: string;
      details?: string;
    }) => {
      // Step 1: Create Safe Transaction
      const response = await projectActions.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'c2cProject.createSafeTransaction',
          payload: {
            amount: totalAmount,
          },
        },
      });

      const safeTxHash = response.data.safeTxHash;
      const safeAddress = response.data.safeAddress;

      // Step 2: Add Disbursement
      const disbursementResult = await addDisbursement.mutateAsync({
        // amount: String(+amount / beneficiaryAddresses.length),
        amount,
        projectUUID,
        type: DisbursementType.MULTISIG,
        disbursementType,
        beneficiaries: beneficiaryAddresses,
        beneficiaryGroup,
        transactionHash: safeTxHash,
        from: safeAddress,
        timestamp: String(Math.floor(Date.now() / 1000)), // Convert to seconds timestamp
        details,
      });

      return disbursementResult;
    },
  });
};

export const useGetSafePendingTransactions = (projectUUID: UUID) => {
  const projectActions = useProjectAction(['c2c', 'safe-pending-transactions']);

  const query = useQuery({
    queryKey: ['safe-pending-transactions'],
    queryFn: async () => {
      const response = await projectActions.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'c2cProject.getSafePending',
          payload: {},
        },
      });
      return response.data;
    },
  });

  return query;
};

export const useFindC2CBeneficiaryGroups = (
  projectUUID: UUID,
  payload?: any,
) => {
  const action = useProjectAction();

  const query = useQuery({
    queryKey: ['beneficiary_groups', projectUUID, payload],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'c2cProject.beneficiary.getAllGroups',
          payload: payload || {},
        },
      });
      return { data: res.data, meta: res.response.meta };
    },
  });

  const data = query?.data || [];

  return {
    ...query,
    data: query?.data?.data || [],
    meta: query?.data?.meta,
  };
};

export const useC2CSingleBeneficiaryGroup = (
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
          action: 'c2cProject.beneficiary.getOneGroup',
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

export const useC2CSingleBeneficiaryGroupMutation = (projectUUID: UUID) => {
  const q = useProjectAction();

  return useMutation({
    mutationFn: async (beneficiariesGroupID: UUID) => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'c2cProject.beneficiary.getOneGroup',
          payload: {
            uuid: beneficiariesGroupID,
          },
        },
      });
      return mutate.data;
    },
  });
};

const GET_ALL_C2C_STATS = 'c2cProject.reporting.list';

export const useFindAllC2cStats = (projectUUID: UUID) => {
  const action = useProjectAction(['findAllc2cStats-rpProject']);

  return useQuery({
    queryKey: ['c2cStats', projectUUID],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: GET_ALL_C2C_STATS,
          payload: {},
        },
      });
      return res.data;
    },
  });
};

export const useGetSafeOwners = (projectUUID: UUID) => {
  const q = useProjectAction();

  return useQuery({
    queryKey: ['safeOwners', projectUUID],
    queryFn: async () => {
      const res = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aidlink.getSafeOwner',
          payload: {},
        },
      });
      return res.data;
    },
  });
};

export const useMutateGraphCall = (projectUUID: UUID) => {
  const { url } = useProjectSettingsStore(
    (state) =>
      state.settings?.[projectUUID]?.[PROJECT_SETTINGS_KEYS.SUBGRAPH] || null,
  );
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });

  const isEmptyResponse = (apiData: any) => {
    if (!apiData) return true;
    return Object.values(apiData).every(
      (value) => Array.isArray(value) && value.length === 0,
    );
  };

  return useMutation({
    mutationFn: async ({
      query,
      variables,
    }: {
      query: string;
      variables?: any;
    }) => {
      const res = await axios.post(
        url,
        JSON.stringify({
          query,
          variables,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (isEmptyResponse(data?.data)) {
        toast.fire({
          title: 'No data found.',
          icon: 'error',
        });
      }
    },

    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || 'An error occured!';
      toast.fire({
        title: 'Error.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

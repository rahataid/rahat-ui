import { useMutation, useQuery } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { PROJECT_SETTINGS_KEYS } from '../../../config';
import { useProjectAction, useProjectSettingsStore } from '../../projects';
import { Pagination } from '@rumsan/sdk/types';
import { Beneficiary } from '@rahataid/sdk';
import Swal from 'sweetalert2';
import { formatEther } from 'viem';

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
} & Pagination;

export const useGetDisbursements = (params: DisbursementListHookParams) => {
  const projectActions = useProjectAction(['c2c', 'disbursements-actions']);
  const { projectUUID, ...restParams } = params;

  const query = useQuery({
    queryKey: ['get-disbursements'],
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
  const { projectUUID, disbursementUUID, ...restParams } = params;

  const query = useQuery({
    queryKey: ['get-disbursement-approvals', disbursementUUID],
    queryFn: async () => {
      const response = await projectActions.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'c2cProject.getSafeTransaction',
          payload: {
            projectUUID: projectUUID,
            ...restParams,
          },
        },
      });
      return response.data;
    },
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
      amount: string;
      beneficiaries: any;
      transactionHash: string;
      from: string;
      timestamp: string;
      status?: DisbursementStatus;
    }) => {
      const { projectUUID, ...restData } = data;
      const response = await projectActions.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'c2cProject.disbursement.create',
          payload: {
            ...restData,
            beneficiaries: restData.beneficiaries.map((ben: any) => ({
              address: ben,
              amount: restData.amount,
              walletAddress: ben,
            })),
          },
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
      beneficiaryAddresses,
      disburseMethod,
      rahatTokenAddress,
      c2cProjectAddress,
    }: {
      amount: string;
      projectUUID: UUID;
      beneficiaryAddresses: `0x${string}`[];
      disburseMethod: string;
      rahatTokenAddress: string;
      c2cProjectAddress: string;
    }) => {
      // Step 1: Create Safe Transaction
      const response = await projectActions.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'c2cProject.createSafeTransaction',
          payload: {
            amount,
          },
        },
      });

      const safeTxHash = response.data.safeTxHash;

      // Step 2: Add Disbursement
      const disbursementResult = await addDisbursement.mutateAsync({
        amount: String(+amount / beneficiaryAddresses.length),
        projectUUID,
        type: DisbursementType.MULTISIG,
        beneficiaries: beneficiaryAddresses,
        transactionHash: safeTxHash,
        from: c2cProjectAddress,
        timestamp: String(Math.floor(Date.now() / 1000)), // Convert to seconds timestamp
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

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
          action: 'c2cProject.disbursement.list',
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
} & Pagination;

export const useGetDisbursementApprovals = (
  params: DisbursementApprovalsHookParams,
) => {
  const projectActions = useProjectAction(['c2c', 'disbursements-actions']);
  const { projectUUID, disbursementUUID, ...restParams } = params;

  const query = useQuery({
    queryKey: ['get-disbursement-approvals'],
    queryFn: async () => {
      const response = await projectActions.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'c2cProject.disbursement.approvals.get',
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
    async onSuccess(data, variables, context) {
      await addDisbursement.mutateAsync({
        amount: variables.amount,
        projectUUID: variables.projectUUID,
        type: DisbursementType.MULTISIG,
        beneficiaries: variables.beneficiaryAddresses,
        transactionHash: data.safeTxHash,
        from: variables.c2cProjectAddress,
        timestamp: String(Math.floor(Date.now() / 1000)), // Convert to seconds timestamp
      });
      console.log('onSuccess', data, variables, context);
    },
    mutationFn: async ({
      amount,
      projectUUID,
    }: {
      amount: string;
      projectUUID: UUID;
      beneficiaryAddresses: `0x${string}`[];
      disburseMethod: string;
      rahatTokenAddress: string;
      c2cProjectAddress: string;
    }) => {
      const response = await projectActions.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'c2cProject.createSafeTransaction',
          payload: {
            amount,
          },
        },
      });
      return response.data;
    },
  });
};

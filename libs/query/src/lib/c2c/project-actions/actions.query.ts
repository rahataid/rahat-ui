import { useQuery } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { PROJECT_SETTINGS_KEYS } from '../../../config';
import { useProjectAction, useProjectSettingsStore } from '../../projects';
import { Pagination } from '@rumsan/sdk/types';

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
          action: 'rahat.jobs.disbursements.get',
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
          action: 'rahat.jobs.disbursement.get',
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
          action: 'rahat.jobs.disbursement.transactions.get',
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
          action: 'rahat.jobs.disbursement.approvals.get',
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

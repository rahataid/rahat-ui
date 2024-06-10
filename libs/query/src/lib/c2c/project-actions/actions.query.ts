import { useQuery } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { PROJECT_SETTINGS_KEYS } from '../../../config';
import { useProjectAction, useProjectSettingsStore } from '../../projects';

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

export const useGetDisbursements = (projectUUID: UUID) => {
  const projectActions = useProjectAction(['c2c', 'disbursements-actions']);

  const query = useQuery({
    queryKey: ['get-disbursements'],
    queryFn: async () => {
      const response = await projectActions.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'disbursements.get',
          payload: {
            projectUUID: projectUUID,
          },
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
          action: 'disbursement.get',
          payload: {
            projectUUID: projectUUID,
            disbursementUUID: disbursementUUID,
          },
        },
      });
      return response.data;
    },
  });

  return query;
};

export const useGetDisbursementTransactions = (
  projectUUID: UUID,
  disbursementUUID: UUID,
) => {
  const projectActions = useProjectAction(['c2c', 'disbursements-actions']);

  const query = useQuery({
    queryKey: ['get-disbursement-transactions', disbursementUUID],
    queryFn: async () => {
      const response = await projectActions.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'disbursement.transactions.get',
          payload: {
            projectUUID: projectUUID,
            disbursementUUID: disbursementUUID,
          },
        },
      });
      return response.data;
    },
  });

  return query;
};

export const useGetDisbursementApprovals = (
  projectUUID: UUID,
  disbursementUUID: UUID,
) => {
  const projectActions = useProjectAction(['c2c', 'disbursements-actions']);

  const query = useQuery({
    queryKey: ['get-disbursement-approvals', disbursementUUID],
    queryFn: async () => {
      const response = await projectActions.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'disbursement.approvals.get',
          payload: {
            projectUUID: projectUUID,
            disbursementUUID: disbursementUUID,
          },
        },
      });
      return response.data;
    },
  });

  return query;
};

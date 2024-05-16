import { useQuery } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { TAGS } from '@rumsan/react-query/utils/tags';
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

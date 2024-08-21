import { useMemo } from 'react';
import { paths } from '../routes/paths';
import { useSettingsStore } from '@rahat-ui/query';
import { title } from 'process';

interface NavItem {
  title: string;
  path: string;
}

export function useNavData() {
  const navSettings = useSettingsStore((state) => state.navSettings);
  console.log(navSettings?.data, navSettings?.subData);
  const data: NavItem[] = useMemo(
    () =>
      navSettings?.data?.length > 0
        ? [...navSettings?.data]
        : [
            {
              title: 'Dashboard',
              path: paths.dashboard.root,
            },
            {
              title: 'Project',
              path: paths.dashboard.project.root,
            },
            {
              title: 'Beneficiaries',
              path: paths.dashboard.beneficiary.root,
            },

            {
              title: 'Communications',
              path: paths.dashboard.communication.text,

              // children: [
              //   {
              //     title: 'Voice',
              //     icon: <Phone />,
              //     path: paths.dashboard.communication.voice,
              //   },
              //   {
              //     title: 'Text',
              //     icon: <MessageSquareMore />,
              //     path: paths.dashboard.communication.text,
              //   },
              // ],
            },
          ],
    [navSettings?.data],
  );
  const subData: NavItem[] = useMemo(
    () =>
      // Temporarily disabled
      // navSettings?.subData?.length > 0
      //   ? [...navSettings?.subData]
      //   :
      [
        {
          title: 'Vendors',
          path: paths.dashboard.vendor,
        },
        {
          title: 'Users',
          path: paths.user.root,
        },
        {
          title: 'Beneficiary Import',
          path: paths.dashboard.communitybeneficiary,
        },
      ],

    [navSettings?.subData],
  );
  return { data, subData };
}

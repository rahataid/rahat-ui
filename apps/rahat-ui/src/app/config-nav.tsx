import { useSettingsStore } from '@rahat-ui/query';
import * as li from 'lucide-react';
import { useMemo } from 'react';
import { paths } from '../routes/paths';

interface NavItem {
  title: string;
  path: string;
  icon: keyof typeof li;
}

export function useNavData() {
  const navSettings = useSettingsStore((state) => state.navSettings);
  const data: NavItem[] = useMemo(
    () =>
      navSettings?.data?.length > 0
        ? [...navSettings?.data]
        : ([
            {
              title: 'Dashboard',
              path: paths.dashboard.root,
              icon: 'HomeIcon',
            },
            {
              title: 'Project',
              path: paths.dashboard.project.root,
              icon: 'Package2',
            },
            {
              title: 'Beneficiaries',
              path: paths.dashboard.beneficiary.root,
              icon: 'Users2',
            },

            {
              title: 'Communications',
              path: paths.dashboard.communication.text,
              icon: 'MessageSquareMoreIcon',

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
          ] as NavItem[]),
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
          icon: 'Truck',
        },
        {
          title: 'Users',
          path: paths.user.root,
          icon: 'UsersIcon',
        },
        {
          title: 'Beneficiary Import',
          path: paths.dashboard.communitybeneficiary,
          icon: 'Upload',
        },
      ] as NavItem[],

    [navSettings?.subData],
  );
  return { data, subData };
}

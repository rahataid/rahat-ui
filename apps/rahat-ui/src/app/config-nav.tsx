import { useMemo } from 'react';
import { paths } from '../routes/paths';
import { useSettingsStore } from '@rahat-ui/query';

interface NavItem {
  title: string;
  path: string;
}

export function useNavData() {
  const navSettings = useSettingsStore((state) => state.navSettings);
  const data: NavItem[] = useMemo(
    () => [
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
      ...(navSettings?.data || []),
    ],
    [navSettings?.data],
  );
  const subData: NavItem[] = useMemo(
    () => [
      {
        title: 'Vendors',
        path: paths.dashboard.vendor,
      },
      {
        title: 'Users',
        path: paths.user.root,
      },

      {
        title: 'Community Beneficiaries',
        path: paths.dashboard.communitybeneficiary,
      },
      ...(navSettings?.subData || []),
    ],
    [navSettings?.subData],
  );
  return { data, subData };
}

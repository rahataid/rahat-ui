import { useMemo } from 'react';
import { paths } from '../routes/paths';
import { Phone, MessageSquareMore } from 'lucide-react';

export function useNavData() {
  const data = useMemo(
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
    ],
    [],
  );
  const subData = useMemo(
    () => [
      {
        title: 'Vendors',
        path: paths.dashboard.vendor,
      },
      {
        title: 'Users',
        path: paths.dashboard.user,
      },
      {
        title: 'Audit',
        path: paths.dashboard.audit,
      },
    ],
    [],
  );
  return { data, subData };
}

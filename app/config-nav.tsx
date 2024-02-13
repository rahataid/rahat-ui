import { useMemo } from 'react';
import { Newspaper, UsersRound, UserRound } from 'lucide-react';
import { paths } from '@/routes/paths';

export function useNavData() {
  const data = useMemo(
    () => [
      {
        title: 'Reporting',
        icon: <Newspaper />,

        path: paths.dashboard.reporting,
      },
      {
        title: 'Beneficiaries List',
        icon: <UsersRound />,
        path: paths.dashboard.beneficiary,
      },
      {
        title: 'Users',
        icon: <UserRound />,
        path: paths.dashboard.user,
      },
    ],
    []
  );
  return data;
}

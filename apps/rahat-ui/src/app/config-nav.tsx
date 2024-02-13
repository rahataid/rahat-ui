import { useMemo } from 'react';
import { Newspaper, UsersRound, UserRound } from 'lucide-react';
import { paths } from '@/routes/paths';

export function useNavData() {
  const data = useMemo(
    () => [
      {
        title: 'Dashboard',
        icon: <Newspape../../routes/paths

        path: paths.dashboard.root,
      },
      {
        title: 'Project',
        icon: <UsersRound />,
        path: paths.dashboard.project,
      },
      {
        title: 'Beneficiaries',
        icon: <UsersRound />,
        path: paths.dashboard.beneficiary,
      },
      {
        title: 'Transactions',
        icon: <UsersRound />,
        path: paths.dashboard.transactions,
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

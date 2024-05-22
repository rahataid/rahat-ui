import { useMemo } from 'react';
import { paths } from '../routes/paths';

export function useNavData() {
  const data = useMemo(
    () => [
      {
        title: 'Dashboard',
        path: paths.dashboard.root,
      },
      {
        title: 'Beneficiary',
        path: paths.dashboard.beneficiary.root,
      },
      {
        title: 'Users',
        path: paths.dashboard.user,
      },
      {
        title: 'Targeting',
        path: paths.dashboard.targeting.root,
      },
    ],
    [],
  );
  const subData = useMemo(() => [], []);
  return { data, subData };
}

'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { AddDailyMonitoring } from 'apps/rahat-ui/src/sections/projects/aa-2/dataSources/components/dailyMonitoring';

const Page = () => {
  return (
    <RoleAuth roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}>
      <AddDailyMonitoring />
    </RoleAuth>
  );
};

export default Page;

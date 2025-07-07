'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { AAUpdateStatus } from 'apps/rahat-ui/src/sections/projects/aa-2/activities';

const Page = () => {
  return (
    <RoleAuth roles={[AARoles.ADMIN, AARoles.MANAGER]}>
      <AAUpdateStatus />
    </RoleAuth>
  );
};

export default Page;

'use client';

import { RoleAuth, AARoles } from '@rahat-ui/auth';
import { AAAddStakeholders } from 'apps/rahat-ui/src/sections/projects/aa-2';

const Page = () => {
  return (
    <RoleAuth roles={[AARoles.ADMIN, AARoles.MANAGER]}>
      <AAAddStakeholders />
    </RoleAuth>
  );
};

export default Page;

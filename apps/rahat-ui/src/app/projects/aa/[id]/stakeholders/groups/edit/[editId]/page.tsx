'use client';

import { RoleAuth, AARoles } from '@rahat-ui/auth';
import { AAUpdateOrAddStakeholdersGroup } from 'apps/rahat-ui/src/sections/projects/aa-2';

const Page = () => {
  return (
    <RoleAuth roles={[AARoles.ADMIN, AARoles.MANAGER]}>
      <AAUpdateOrAddStakeholdersGroup />
    </RoleAuth>
  );
};

export default Page;

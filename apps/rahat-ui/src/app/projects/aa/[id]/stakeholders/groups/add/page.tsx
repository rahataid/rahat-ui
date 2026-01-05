'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { AAUpdateOrAddStakeholdersGroup } from 'apps/rahat-ui/src/sections/projects/aa-2';

const Page = () => {
  return (
    <RoleAuth roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}>
      <AAUpdateOrAddStakeholdersGroup />
    </RoleAuth>
  );
};

export default Page;

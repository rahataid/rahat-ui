'use client';

import { RoleAuth, AARoles } from '@rahat-ui/auth';
import { AAImportStakeholders } from 'apps/rahat-ui/src/sections/projects/aa-2';

const Page = () => {
  return (
    <RoleAuth roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}>
      <AAImportStakeholders />
    </RoleAuth>
  );
};

export default Page;

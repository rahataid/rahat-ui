'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { AAFundManagementDetailView } from 'apps/rahat-ui/src/sections/projects/aa-2';

const Page = () => {
  return (
    <RoleAuth roles={[AARoles.ADMIN, AARoles.MANAGER]}>
      <AAFundManagementDetailView />
    </RoleAuth>
  );
};

export default Page;

'use client';

import { RoleAuth, AARoles } from '@rahat-ui/auth';
import { AAFundManagementView } from 'apps/rahat-ui/src/sections/projects/aa-2';

const Page = () => {
  return (
    <RoleAuth
      roles={[
        AARoles.ADMIN,
        AARoles.MANAGER,
        AARoles.UNICEF_DONOR,
        AARoles.UNICEF_FIELD_OFFICE,
        AARoles.UNICEF_HEAD_OFFICE,
      ]}
    >
      <AAFundManagementView />
    </RoleAuth>
  );
};

export default Page;

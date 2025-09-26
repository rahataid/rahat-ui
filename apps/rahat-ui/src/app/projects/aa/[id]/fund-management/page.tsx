'use client';

import { RoleAuth, AARoles } from '@rahat-ui/auth';
import { AAFundManagementView } from 'apps/rahat-ui/src/sections/projects/aa-2';

const Page = () => {
  return (
    <RoleAuth
      roles={[
        AARoles.ADMIN,
        AARoles.MANAGER,
        AARoles.UNICEFNepalCO,
        AARoles.Municipality,
      ]}
    >
      <AAFundManagementView />
    </RoleAuth>
  );
};

export default Page;

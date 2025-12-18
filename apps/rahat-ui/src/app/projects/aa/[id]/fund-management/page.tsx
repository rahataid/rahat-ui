'use client';

import { RoleAuth, AARoles } from '@rahat-ui/auth';
import { AAFundManagementView } from 'apps/rahat-ui/src/sections/projects/aa-2';

const Page = () => {
  return (
    <RoleAuth
      roles={[AARoles.UNICEFNepalCO, AARoles.Municipality, AARoles.ADMIN]}
    >
      <AAFundManagementView />
    </RoleAuth>
  );
};

export default Page;

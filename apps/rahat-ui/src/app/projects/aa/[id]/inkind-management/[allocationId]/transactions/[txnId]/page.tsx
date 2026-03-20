'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { InkindTransactionDetail } from 'apps/rahat-ui/src/sections/projects/aa-2/inkindManagement/components';

const Page = () => {
  return (
    <RoleAuth
      roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality, AARoles.UNICEFNepalCO]}
    >
      <InkindTransactionDetail />
    </RoleAuth>
  );
};

export default Page;

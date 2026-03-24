'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { InkindAllocationDetail } from 'apps/rahat-ui/src/sections/projects/aa-2/inkindManagement/components';

const Page = () => {
  return (
    <RoleAuth
      roles={[
        AARoles.ADMIN,
        AARoles.MANAGER,
        AARoles.Municipality,
        AARoles.UNICEFNepalCO,
      ]}
    >
      <InkindAllocationDetail />
    </RoleAuth>
  );
};

export default Page;

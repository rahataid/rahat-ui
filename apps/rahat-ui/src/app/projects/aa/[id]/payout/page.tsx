'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { PayoutView } from 'apps/rahat-ui/src/sections/projects/aa-2/payout';

const Page = () => {
  return (
    <RoleAuth
      roles={[
        AARoles.ADMIN,
        AARoles.UNICEFNepalCO,
        AARoles.Municipality,
        AARoles.MANAGER,
      ]}
    >
      <PayoutView />
    </RoleAuth>
  );
};

export default Page;

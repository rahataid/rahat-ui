'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { PaymentInitiation } from 'apps/rahat-ui/src/sections/projects/aa-2/payout';

const Page = () => {
  return (
    <RoleAuth roles={[AARoles.ADMIN]}>
      <PaymentInitiation />
    </RoleAuth>
  );
};

export default Page;

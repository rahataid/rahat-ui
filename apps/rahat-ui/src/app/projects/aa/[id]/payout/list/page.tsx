'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { PayoutTransactionList } from 'apps/rahat-ui/src/sections/projects/aa-2/payout';

const Page = () => {
  return (
    <RoleAuth roles={[AARoles.ADMIN, AARoles.MANAGER]}>
      <PayoutTransactionList />
    </RoleAuth>
  );
};

export default Page;

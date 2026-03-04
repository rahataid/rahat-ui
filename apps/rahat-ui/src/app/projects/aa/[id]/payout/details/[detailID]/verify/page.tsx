'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { VerificationPayout } from 'apps/rahat-ui/src/sections/projects/aa-2';

const Page = () => {
  return (
    <RoleAuth roles={[AARoles.ADMIN, AARoles.Municipality]}>
      <VerificationPayout />
    </RoleAuth>
  );
};

export default Page;

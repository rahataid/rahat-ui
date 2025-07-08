'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { AAEditActivity } from 'apps/rahat-ui/src/sections/projects/aa-2/activities';

const Page = () => {
  return (
    <RoleAuth roles={[AARoles.ADMIN, AARoles.MANAGER]}>
      <AAEditActivity />
    </RoleAuth>
  );
};

export default Page;

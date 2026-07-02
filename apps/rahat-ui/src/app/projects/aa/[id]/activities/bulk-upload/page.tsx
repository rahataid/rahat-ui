'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { BulkUploadActivities } from 'apps/rahat-ui/src/sections/projects/aa-2/activities';

const Page = () => {
  return (
    <RoleAuth roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}>
      <BulkUploadActivities />
    </RoleAuth>
  );
};

export default Page;

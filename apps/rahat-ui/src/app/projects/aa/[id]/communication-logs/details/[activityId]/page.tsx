'use client';

import { AACommunicationDetailsView } from 'apps/rahat-ui/src/sections/projects/aa-2/communicationLog';
import { AARoles, RoleAuth } from '@rahat-ui/auth';

const Page = () => {
  return (
    <RoleAuth roles={[AARoles.ADMIN, AARoles.MANAGER]}>
      <AACommunicationDetailsView />
    </RoleAuth>
  );
};

export default Page;

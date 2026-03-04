'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { AACommunicationMainLogsView } from 'apps/rahat-ui/src/sections/projects/aa-2/communicationLog';

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
      <AACommunicationMainLogsView />
    </RoleAuth>
  );
};

export default Page;

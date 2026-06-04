'use client';

import { AAProjectSettingsView } from 'apps/rahat-ui/src/sections/projects/aa-2/settings';
import { AARoles } from 'libs/auth/src/enums/aaRoles';
import { RoleAuth } from 'libs/auth/src/lib/roleAuth';

const Page = () => {
  return (
    <RoleAuth roles={[AARoles.ADMIN]}>
      <AAProjectSettingsView />
    </RoleAuth>
  );
};

export default Page;

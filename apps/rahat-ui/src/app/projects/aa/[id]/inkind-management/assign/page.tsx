'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import AssignInkindView from 'apps/rahat-ui/src/sections/projects/aa-2/inkindManagement/assign.inkind';

const AssignInkindPage = () => {
  return (
    <RoleAuth roles={[AARoles.ADMIN, AARoles.Municipality]}>
      <AssignInkindView />
    </RoleAuth>
  );
};

export default AssignInkindPage;

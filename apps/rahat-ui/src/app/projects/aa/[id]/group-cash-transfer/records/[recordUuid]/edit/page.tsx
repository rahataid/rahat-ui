'use client';

import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import ProjectPermissionGuard from 'apps/rahat-ui/src/guards/project-permission-guard';
import EditGctRecord from 'apps/rahat-ui/src/sections/projects/aa-2/groupCashTransfer/edit.gct.record';

const page = () => (
  <ProjectPermissionGuard
    action={ACTIONS.UPDATE}
    subject={SUBJECTS.GROUP_CASH_TRANSFER}
  >
    <EditGctRecord />
  </ProjectPermissionGuard>
);

export default page;

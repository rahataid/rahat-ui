'use client';

import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import ProjectPermissionGuard from 'apps/rahat-ui/src/guards/project-permission-guard';
import EditGct from 'apps/rahat-ui/src/sections/projects/aa-2/groupCashTransfer/edit.gct';

const page = () => {
  return (
    <ProjectPermissionGuard
      action={ACTIONS.UPDATE}
      subject={SUBJECTS.GROUP_CASH_TRANSFER}
    >
      <EditGct />
    </ProjectPermissionGuard>
  );
};

export default page;

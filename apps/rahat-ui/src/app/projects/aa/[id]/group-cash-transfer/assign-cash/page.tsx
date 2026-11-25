'use client';

import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import ProjectPermissionGuard from 'apps/rahat-ui/src/guards/project-permission-guard';
import AssignCashGct from 'apps/rahat-ui/src/sections/projects/aa-2/groupCashTransfer/assign.cash.gct';

const page = () => {
  return (
    <ProjectPermissionGuard
      action={ACTIONS.CREATE}
      subject={SUBJECTS.GROUP_CASH_TRANSFER}
    >
      <AssignCashGct />
    </ProjectPermissionGuard>
  );
};

export default page;

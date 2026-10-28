'use client';

import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import ProjectPermissionGuard from 'apps/rahat-ui/src/guards/project-permission-guard';
import GroupCashTransferView from 'apps/rahat-ui/src/sections/projects/aa-2/groupCashTransfer/main';

const page = () => {
  return (
    <ProjectPermissionGuard
      action={ACTIONS.READ}
      subject={SUBJECTS.GROUP_CASH_TRANSFER}
    >
      <GroupCashTransferView />
    </ProjectPermissionGuard>
  );
};

export default page;

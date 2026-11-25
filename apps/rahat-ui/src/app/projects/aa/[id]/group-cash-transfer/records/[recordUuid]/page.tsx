'use client';

import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import ProjectPermissionGuard from 'apps/rahat-ui/src/guards/project-permission-guard';
import GctRecordDetail from 'apps/rahat-ui/src/sections/projects/aa-2/groupCashTransfer/components/gct.record.detail';

const page = () => {
  return (
    <ProjectPermissionGuard
      action={ACTIONS.READ}
      subject={SUBJECTS.GROUP_CASH_TRANSFER}
    >
      <GctRecordDetail />
    </ProjectPermissionGuard>
  );
};

export default page;

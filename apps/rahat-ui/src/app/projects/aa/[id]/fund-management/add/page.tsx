'use client';

import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import ProjectPermissionGuard from 'apps/rahat-ui/src/guards/project-permission-guard';
import { AAAssignFundsView } from 'apps/rahat-ui/src/sections/projects/aa-2';

const AddFundManagement = () => {
  return (
    <ProjectPermissionGuard
      action={ACTIONS.CREATE}
      subject={SUBJECTS.FUND_MANAGEMENT}
    >
      <AAAssignFundsView />
    </ProjectPermissionGuard>
  );
};

export default AddFundManagement;

'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import ProjectPermissionGuard from 'apps/rahat-ui/src/guards/project-permission-guard';
import { BeneficiaryGroupTransactionDetailsList } from 'apps/rahat-ui/src/sections/projects/aa-2/payout';

const Page = () => {
  return (
    <ProjectPermissionGuard action={ACTIONS.READ} subject={SUBJECTS.PAYOUT}>
      <BeneficiaryGroupTransactionDetailsList />
    </ProjectPermissionGuard>
  );
};

export default Page;

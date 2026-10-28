'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import ProjectPermissionGuard from 'apps/rahat-ui/src/guards/project-permission-guard';
import { PaymentInitiation } from 'apps/rahat-ui/src/sections/projects/aa-2/payout';

const Page = () => {
  return (
    <ProjectPermissionGuard action={ACTIONS.CREATE} subject={SUBJECTS.PAYOUT}>
      <PaymentInitiation />
    </ProjectPermissionGuard>
  );
};

export default Page;

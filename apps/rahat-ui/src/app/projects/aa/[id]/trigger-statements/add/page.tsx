'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import dynamic from 'next/dynamic';
import { ProjectPermissionGuard } from 'apps/rahat-ui/src/guards/project-permission-guard';
import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';

const AddTriggerStatementPage = dynamic(
  () =>
    import('apps/rahat-ui/src/sections/projects/aa-2/triggerStatement').then(
      (mod) => mod.AATriggerStatementAddView,
    ),
  {
    ssr: false,
  },
);

export default function Page() {
  return (
    <ProjectPermissionGuard action={ACTIONS.CREATE} subject={SUBJECTS.TRIGGER}>
      <AddTriggerStatementPage />
    </ProjectPermissionGuard>
  );
}

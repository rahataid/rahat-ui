'use client';

import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import ProjectPermissionGuard from 'apps/rahat-ui/src/guards/project-permission-guard';
import dynamic from 'next/dynamic';

const StakeholderEditPage = dynamic(
  () =>
    import('apps/rahat-ui/src/sections/projects/aa-2').then(
      (mod) => mod.AAEditStakeholdersView,
    ),
  {
    ssr: false,
  },
);

export default function Page() {
  return (
    <ProjectPermissionGuard
      action={ACTIONS.UPDATE}
      subject={SUBJECTS.STAKEHOLDER}
    >
      <StakeholderEditPage />
    </ProjectPermissionGuard>
  );
}

'use client';

import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import ProjectPermissionGuard from 'apps/rahat-ui/src/guards/project-permission-guard';
import dynamic from 'next/dynamic';

const StakeholderDetailPage = dynamic(
  () =>
    import('apps/rahat-ui/src/sections/projects/aa-2').then(
      (mod) => mod.AAStakeholdersDetails,
    ),
  {
    ssr: false,
  },
);

export default function Page() {
  return (
    <ProjectPermissionGuard action={ACTIONS.READ} subject={SUBJECTS.STAKEHOLDER}>
      <StakeholderDetailPage />
    </ProjectPermissionGuard>
  );
}

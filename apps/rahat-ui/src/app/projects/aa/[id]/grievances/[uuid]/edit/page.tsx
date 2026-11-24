'use client';

import dynamic from 'next/dynamic';

import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import ProjectPermissionGuard from 'apps/rahat-ui/src/guards/project-permission-guard';

const GrievancesEditPage = dynamic(
  () =>
    import('apps/rahat-ui/src/sections/projects/aa-2/grievances').then(
      (mod) => mod.AAGrievancesEdit,
    ),
  {
    ssr: false,
  },
);

export default function Page() {
  return (
    <ProjectPermissionGuard
      action={ACTIONS.UPDATE}
      subject={SUBJECTS.GRIEVANCE}
    >
      <GrievancesEditPage />
    </ProjectPermissionGuard>
  );
}

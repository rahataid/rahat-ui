'use client';

import dynamic from 'next/dynamic';

import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import ProjectPermissionGuard from 'apps/rahat-ui/src/guards/project-permission-guard';

const GrievancesAddPage = dynamic(
  () =>
    import('apps/rahat-ui/src/sections/projects/aa-2/grievances').then(
      (mod) => mod.AAGrievancesAdd,
    ),
  {
    ssr: false,
  },
);

export default function Page() {
  return (
    <ProjectPermissionGuard
      action={ACTIONS.CREATE}
      subject={SUBJECTS.GRIEVANCE}
    >
      <GrievancesAddPage />
    </ProjectPermissionGuard>
  );
}

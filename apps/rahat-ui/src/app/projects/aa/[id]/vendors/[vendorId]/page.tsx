'use client';

import dynamic from 'next/dynamic';
import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import ProjectPermissionGuard from 'apps/rahat-ui/src/guards/project-permission-guard';

const VendorDetailsPage = dynamic(
  () =>
    import('apps/rahat-ui/src/sections/projects/aa-2/vendor').then(
      (mod) => mod.AAVendorDetail,
    ),
  {
    ssr: false,
  },
);

export default function Page() {
  return (
    <ProjectPermissionGuard action={ACTIONS.READ} subject={SUBJECTS.VENDOR}>
      <VendorDetailsPage />
    </ProjectPermissionGuard>
  );
}

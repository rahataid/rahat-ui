'use client';

import { RoleAuth, AARoles } from '@rahat-ui/auth';
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
    <RoleAuth roles={[AARoles.ADMIN, AARoles.MANAGER]}>
      <StakeholderEditPage />;
    </RoleAuth>
  );
}

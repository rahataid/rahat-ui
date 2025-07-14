'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import dynamic from 'next/dynamic';

const TriggerStatementEditPage = dynamic(
  () =>
    import('apps/rahat-ui/src/sections/projects/aa-2/triggerStatement').then(
      (mod) => mod.AATriggerStatementEditView,
    ),
  {
    ssr: false,
  },
);

export default function Page() {
  return (
    <RoleAuth roles={[AARoles.ADMIN, AARoles.MANAGER]}>
      <TriggerStatementEditPage />
    </RoleAuth>
  );
}

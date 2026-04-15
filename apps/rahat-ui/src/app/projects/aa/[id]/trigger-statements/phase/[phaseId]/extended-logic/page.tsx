'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import dynamic from 'next/dynamic';

const ExtendedLogicPage = dynamic(
  () =>
    import('apps/rahat-ui/src/sections/projects/aa-2/triggerStatement').then(
      (mod) => mod.AAExtendedLogicConfigView,
    ),
  {
    ssr: false,
  },
);

export default function Page() {
  return (
    <RoleAuth roles={[AARoles.ADMIN, AARoles.Municipality]}>
      <ExtendedLogicPage />
    </RoleAuth>
  );
}

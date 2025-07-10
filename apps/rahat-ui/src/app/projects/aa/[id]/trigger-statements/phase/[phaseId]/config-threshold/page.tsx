'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import dynamic from 'next/dynamic';

const ConfigureThreshold = dynamic(
  () =>
    import('apps/rahat-ui/src/sections/projects/aa-2/triggerStatement').then(
      (mod) => mod.AAConfigureThreshold,
    ),
  {
    ssr: false,
  },
);

export default function Page() {
  return (
    <RoleAuth roles={[AARoles.ADMIN, AARoles.MANAGER]}>
      <ConfigureThreshold />
    </RoleAuth>
  );
}

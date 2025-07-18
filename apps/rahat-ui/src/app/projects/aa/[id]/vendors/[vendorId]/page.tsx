'use client';

import dynamic from 'next/dynamic';
import { AARoles, RoleAuth } from '@rahat-ui/auth';

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
    <RoleAuth roles={[AARoles.ADMIN, AARoles.MANAGER]}>
      <VendorDetailsPage />
    </RoleAuth>
  );
}

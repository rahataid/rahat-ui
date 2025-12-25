'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import dynamic from 'next/dynamic';

const VendorsPage = dynamic(
  () =>
    import('apps/rahat-ui/src/sections/projects/aa-2/vendor').then(
      (mod) => mod.AAVendorsView,
    ),
  {
    ssr: false,
  },
);

export default function Page() {
  return (
    <RoleAuth roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.UNICEFNepalCO]}>
      <VendorsPage />
    </RoleAuth>
  );
}

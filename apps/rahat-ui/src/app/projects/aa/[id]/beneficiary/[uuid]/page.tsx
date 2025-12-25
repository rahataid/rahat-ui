'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import dynamic from 'next/dynamic';

const BeneficaryDetailPage = dynamic(
  () =>
    import('apps/rahat-ui/src/sections/projects/aa-2/beneficiary').then(
      (mod) => mod.AABeneficiaryDetails,
    ),
  {
    ssr: false,
  },
);

export default function Page() {
  return (
    <RoleAuth
      roles={[
        AARoles.ADMIN,
        AARoles.MANAGER,
        AARoles.Municipality,
        AARoles.UNICEFNepalCO,
      ]}
    >
      <BeneficaryDetailPage />
    </RoleAuth>
  );
}

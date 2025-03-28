'use client';

import dynamic from 'next/dynamic';

const StakeholderDetailPage = dynamic(
  () =>
    import('apps/rahat-ui/src/sections/projects/aa-2').then(
      (mod) => mod.AAStakeholdersDetails,
    ),
  {
    ssr: false,
  },
);

export default function Page() {
  return <StakeholderDetailPage />;
}

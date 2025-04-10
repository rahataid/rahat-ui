'use client';

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
  return <StakeholderEditPage />;
}

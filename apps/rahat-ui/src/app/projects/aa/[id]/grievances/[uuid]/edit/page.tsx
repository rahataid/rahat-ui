'use client';

import dynamic from 'next/dynamic';

const GrievancesEditPage = dynamic(
  () =>
    import('apps/rahat-ui/src/sections/projects/aa-2/grievances').then(
      (mod) => mod.AAGrievancesEdit,
    ),
  {
    ssr: false,
  },
);

export default function Page() {
  return <GrievancesEditPage />;
}

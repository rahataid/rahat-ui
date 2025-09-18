'use client';

import dynamic from 'next/dynamic';

const GrievancesAddPage = dynamic(
  () =>
    import('apps/rahat-ui/src/sections/projects/aa-2/grievances').then(
      (mod) => mod.AAGrievancesAdd,
    ),
  {
    ssr: false,
  },
);

export default function Page() {
  return <GrievancesAddPage />;
}

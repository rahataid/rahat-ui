'use client';

import dynamic from 'next/dynamic';

const GrievancesDetailPage = dynamic(
  () =>
    import('apps/rahat-ui/src/sections/projects/aa-2/grievances').then(
      (mod) => mod.AAGrievancesDetails,
    ),
  {
    ssr: false,
  },
);

export default function Page() {
  return <GrievancesDetailPage />;
}

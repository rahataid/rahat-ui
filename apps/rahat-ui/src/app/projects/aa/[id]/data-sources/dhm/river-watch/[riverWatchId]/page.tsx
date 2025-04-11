'use client';

import dynamic from 'next/dynamic';

const RiverWatchPage = dynamic(
  () =>
    import('apps/rahat-ui/src/sections/projects/aa-2/dataSources').then(
      (mod) => mod.AADHMRiverWatchDetails,
    ),
  {
    ssr: false,
  },
);

export default function Page() {
  return <RiverWatchPage />;
}

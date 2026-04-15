'use client';

import dynamic from 'next/dynamic';

const HumidityWatchPage = dynamic(
  () =>
    import('apps/rahat-ui/src/sections/projects/aa-2/dataSources').then(
      (mod) => mod.AAHumidityWatchDetails,
    ),
  {
    ssr: false,
  },
);

export default function Page() {
  return <HumidityWatchPage />;
}

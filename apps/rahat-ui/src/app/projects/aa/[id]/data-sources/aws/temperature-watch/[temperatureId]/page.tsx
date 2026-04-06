'use client';

import dynamic from 'next/dynamic';

const TemperatureWatchPage = dynamic(
  () =>
    import('apps/rahat-ui/src/sections/projects/aa-2/dataSources').then(
      (mod) => mod.AATemperatureWatchDetails,
    ),
  {
    ssr: false,
  },
);

export default function Page() {
  return <TemperatureWatchPage />;
}

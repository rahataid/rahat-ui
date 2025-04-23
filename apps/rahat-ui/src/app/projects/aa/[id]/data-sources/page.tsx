'use client';

import dynamic from 'next/dynamic';

const DataSourcesPage = dynamic(
  () =>
    import('apps/rahat-ui/src/sections/projects/aa-2/dataSources').then(
      (mod) => mod.AADataSourcesView,
    ),
  {
    ssr: false,
  },
);

export default function Page() {
  return <DataSourcesPage />;
}

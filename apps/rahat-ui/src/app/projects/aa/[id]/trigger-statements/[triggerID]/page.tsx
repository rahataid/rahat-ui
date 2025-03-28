'use client';

import dynamic from 'next/dynamic';

const TriggerStatementDetailPage = dynamic(
  () =>
    import('apps/rahat-ui/src/sections/projects/aa-2/triggerStatement').then(
      (mod) => mod.AATriggerStatementDetailView,
    ),
  {
    ssr: false,
  },
);

export default function Page() {
  return <TriggerStatementDetailPage />;
}

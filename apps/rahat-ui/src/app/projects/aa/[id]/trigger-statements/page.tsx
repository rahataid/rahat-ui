'use client';

import dynamic from 'next/dynamic';

const TriggerStatementPage = dynamic(
  () =>
    import('apps/rahat-ui/src/sections/projects/aa-2/triggerStatement').then(
      (mod) => mod.AATriggerStatementView,
    ),
  {
    ssr: false,
  },
);

export default function Page() {
  return <TriggerStatementPage />;
}

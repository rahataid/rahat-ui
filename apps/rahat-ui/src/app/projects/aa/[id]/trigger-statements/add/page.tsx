'use client';

import dynamic from 'next/dynamic';

const AddTriggerStatementPage = dynamic(
  () =>
    import('apps/rahat-ui/src/sections/projects/aa-2/triggerStatement').then(
      (mod) => mod.AATriggerStatementAddView,
    ),
  {
    ssr: false,
  },
);

export default function Page() {
  return <AddTriggerStatementPage />;
}

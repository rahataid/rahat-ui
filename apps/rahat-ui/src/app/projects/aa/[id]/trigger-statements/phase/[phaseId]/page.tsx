'use client';

import dynamic from 'next/dynamic';

const PhaseDetailPage = dynamic(
  () =>
    import('apps/rahat-ui/src/sections/projects/aa-2/triggerStatement').then(
      (mod) => mod.AAPhaseDetailView,
    ),
  {
    ssr: false,
  },
);

export default function Page() {
  return <PhaseDetailPage />;
}

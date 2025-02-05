'use client';

import dynamic from 'next/dynamic';

const TextCampaignPage = dynamic(
  () => import('packages/modules').then((mod) => mod.TextCampaign),
  {
    ssr: false,
  },
);

export default function Page() {
  return <TextCampaignPage />;
}

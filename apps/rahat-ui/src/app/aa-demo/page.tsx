'use client';

import dynamic from 'next/dynamic';

const BeneficiaryView = dynamic(
  () => import('packages/modules').then((mod) => mod.BeneficiaryView),
  { ssr: false },
);
const BeneficiaryDetail = dynamic(
  () => import('packages/modules').then((mod) => mod.BeneficiaryDetails),
  { ssr: false },
);

const StakeholdersView = dynamic(
  () => import('packages/modules').then((mod) => mod.StakeholdersView),
  { ssr: false },
);

export default function DemoPage() {
  return (
    <>
      <StakeholdersView />
    </>
  );
}

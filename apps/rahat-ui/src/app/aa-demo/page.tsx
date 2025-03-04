'use client';

import dynamic from 'next/dynamic';

const BeneficiaryView = dynamic(
  () => import('packages/modules').then((mod) => mod.BeneficiaryView),
  { ssr: false },
);
const StakeholdersView = dynamic(
  () => import('packages/modules').then((mod) => mod.StakeholdersView),
  { ssr: false },
);

const ImportStakeholders = dynamic(
  () => import('packages/modules').then((mod) => mod.ImportStakeholders),
  { ssr: false },
);

export default function DemoPage() {
  return (
    <>
      <ImportStakeholders />
    </>
  );
}

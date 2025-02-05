'use client';

import { useParams } from 'next/navigation';
import { useProject } from '@rahat-ui/query';
import dynamic from 'next/dynamic';
import { UUID } from 'crypto';

const CommsDashboard = dynamic(
  () => import('packages/modules').then((mod) => mod.CommsDashboard),
  { ssr: false },
);

function Page() {
  const { id } = useParams();
  useProject(id as UUID);

  return <CommsDashboard />;
}

export default Page;

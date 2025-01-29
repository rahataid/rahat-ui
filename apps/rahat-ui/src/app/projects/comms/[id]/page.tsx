'use client';

import { useParams } from 'next/navigation';
import { useProject } from '@rahat-ui/query';
import { UUID } from 'crypto';
import dynamic from 'next/dynamic';
import { CommsDashboard } from 'modules';

function Page() {
  const { id } = useParams();
  useProject(id as UUID);
  return <CommsDashboard />;
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});

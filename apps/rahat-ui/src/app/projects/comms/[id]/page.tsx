'use client';

import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { useProject } from '@rahat-ui/query';
import { CommsProjectView } from 'apps/rahat-ui/src/sections/projects/comms';

const Page = () => {
  const { id } = useParams();
  useProject(id as UUID);
  return <CommsProjectView />;
};

export default Page;

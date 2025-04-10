'use client';

import { useProject } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { AAProjectDashboard } from 'apps/rahat-ui/src/sections/projects/aa-2';

const Page = () => {
  const { id } = useParams();
  useProject(id as UUID);
  return <AAProjectDashboard />;
};

export default Page;

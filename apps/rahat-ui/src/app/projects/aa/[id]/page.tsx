'use client';

import { useProject } from '@rahat-ui/query';
import { AAProjectView } from 'apps/rahat-ui/src/sections/projects/aa';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';

const Page = () => {
  const { id } = useParams();
  useProject(id as UUID);
  return <AAProjectView />;
};

export default Page;

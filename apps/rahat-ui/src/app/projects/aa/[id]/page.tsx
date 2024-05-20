'use client';

import { useProject } from '@rahat-ui/query';
import { AAProjectDetailView } from '../../../../sections/projects/aa';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';

const Page = () => {
  const { id } = useParams();
  useProject(id as UUID);
  return <AAProjectDetailView />;
};

export default Page;

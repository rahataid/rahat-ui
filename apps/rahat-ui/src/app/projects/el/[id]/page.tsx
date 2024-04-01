'use client';

import { useProject } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { ELProjectView } from '../../../../sections/projects/el';

const Page = () => {
  const { id } = useParams();
  useProject(id as UUID);
  return <ELProjectView />;
};

export default Page;

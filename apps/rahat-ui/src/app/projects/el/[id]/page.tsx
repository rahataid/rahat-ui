'use client';

import { useParams } from 'next/navigation';
import { ELProjectView } from '../../../../sections/projects/el';
import { useProject, useProjectSettings } from '@rahat-ui/query';
import { UUID } from 'crypto';

const Page = () => {
  const { id } = useParams();
  useProject(id as UUID);
  useProjectSettings(id as UUID);
  return <ELProjectView />;
};

export default Page;

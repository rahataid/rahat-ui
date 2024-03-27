'use client';

import { useParams } from 'next/navigation';
import { ELProjectView } from '../../../../sections/projects/el';
import { useProjectSettings } from '@rahat-ui/query';
import { UUID } from 'crypto';

const Page = () => {
  const { id } = useParams();
  useProjectSettings(id as UUID);
  return <ELProjectView />;
};

export default Page;

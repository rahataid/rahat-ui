'use client';

import { useProject } from '@rahat-ui/query';
import { ELCRMProjectView } from 'apps/rahat-ui/src/sections/projects/el-crm';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';

const Page = () => {
  const { id } = useParams();
  useProject(id as UUID);

  return <ELCRMProjectView />;
};

export default Page;

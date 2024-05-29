'use client';
import { useProject } from '@rahat-ui/query';
import { CVAProjectView } from 'apps/rahat-ui/src/sections/projects/cva';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';

const Page = () => {
  const { id } = useParams();
  useProject(id as UUID);
  return <CVAProjectView />;
};

export default Page;

'use client';
import { useProject } from '@rahat-ui/query';
import { RPProjectView } from 'apps/rahat-ui/src/sections/projects/rp';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';

const Page = () => {
  const { id } = useParams();
  useProject(id as UUID);
  return <RPProjectView />;
};

export default Page;

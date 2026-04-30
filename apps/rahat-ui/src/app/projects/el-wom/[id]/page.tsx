'use client';
import { useProject } from '@rahat-ui/query';
import { ELKenyaProjectView } from 'apps/rahat-ui/src/sections/projects/sms-voucher';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';

const Page = () => {
  const { id } = useParams();
  useProject(id as UUID);
  return <ELKenyaProjectView />;
};

export default Page;

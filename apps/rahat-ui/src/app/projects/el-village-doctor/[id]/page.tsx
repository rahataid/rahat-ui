'use client';
import React from 'react';
import { useProject } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { CambodiaProjectView } from 'apps/rahat-ui/src/sections/projects/cambodia';

const Page = () => {
  const { id } = useParams();
  useProject(id as UUID);
  return <CambodiaProjectView />;
};

export default Page;

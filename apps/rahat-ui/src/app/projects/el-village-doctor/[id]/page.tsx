'use client';
import React from 'react';
import { useProject } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { VillageDoctorProjectView } from 'apps/rahat-ui/src/sections/projects/village-doctor';

const Page = () => {
  const { id } = useParams();
  useProject(id as UUID);
  return <VillageDoctorProjectView />;
};

export default Page;

'use client';

import { useProject } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { AAProjectDashboard } from 'apps/rahat-ui/src/sections/projects/aa-2';
import Main from 'apps/rahat-ui/src/sections/projects/aa-2/dashboard/main';

const Page = () => {
  // return <AAProjectDashboard />;
  return <Main />;
};

export default Page;

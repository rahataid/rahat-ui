'use client';

import { ActivitiesList } from 'apps/rahat-ui/src/sections/projects/aa-2/activities';
import { useParams } from 'next/navigation';

const Page = () => {
  const { title } = useParams();
  console.log(title);

  return <ActivitiesList />;
};

export default Page;

'use client';

import dynamic from 'next/dynamic';

const GlofasDetails = dynamic(() =>
  import(
    'apps/rahat-ui/src/sections/projects/aa-2/dataSources/components/glofas/glofasDetials'
  ).then((mod) => mod.GlofasDetails),
);

const Page = () => {
  return <GlofasDetails />;
};
export default Page;

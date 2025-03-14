'use client';

import dynamic from 'next/dynamic';

const VendorDetailsPage = dynamic(
  () => import('apps/rahat-ui/src/sections/projects/aa-2/vendor').then((mod) => mod.AAVendorDetail),
  {
    ssr: false,
  },
);

export default function Page() {
  return <VendorDetailsPage />;
}

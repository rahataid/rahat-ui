'use client';

import { Nav } from '../../components/nav';

export default function VendorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <div className="mx-8">{children}</div>
    </>
  );
}

'use client';

import { Nav } from '../../components/nav';

export default function TransactionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <div className="mx-2">{children}</div>
    </>
  );
}

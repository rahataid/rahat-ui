'use client';

import Nav from '../../components/projects/nav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <div className="mx-8">{children}</div>
    </>
  );
}

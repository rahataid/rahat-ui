'use client';

import Nav from '../../components/projects/nav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav title={'Profile'} />
      <div className="mx-8">{children}</div>
    </>
  );
}

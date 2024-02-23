'use client';

import { Nav } from '../../components/nav';
import * as React from 'react';

export default function ProjectLayout({
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

'use client';

import * as React from 'react';
import { Nav } from '../../components/nav';

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

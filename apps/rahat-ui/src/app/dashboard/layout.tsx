'use client';

import { Nav } from '../../components/nav';
import * as React from 'react';

export default function DashboardLayout({
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

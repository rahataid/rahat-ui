'use client';

import * as React from 'react';
import { ELLayout } from '../../../../sections/projects/el';

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <ELLayout>{children}</ELLayout>
  );
}

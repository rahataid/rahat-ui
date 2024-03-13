'use client';

import * as React from 'react';
import { AALayout } from '../../../../sections/projects/aa';

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AALayout>{children}</AALayout>;
}

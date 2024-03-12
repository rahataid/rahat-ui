'use client';

import * as React from 'react';
import { CVALayout } from '../../../../sections/projects/cva';

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CVALayout>{children}</CVALayout>;
}

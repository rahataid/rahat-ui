import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type IProps = {
  path: string;
};

export function Back({ path }: IProps) {
  return (
    <Link href={path} className="flex space-x-2 items-center mb-2">
      <ArrowLeft
        size={25}
        strokeWidth={2}
        className="cursor-pointer opacity-70 hover:opacity-100"
      />
      <p className="text-base text-muted-foreground">Back</p>
    </Link>
  );
}

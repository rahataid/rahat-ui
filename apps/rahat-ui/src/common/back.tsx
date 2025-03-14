import React from 'react';
import { ArrowLeft, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

type IProps = {
  path: string;
};

export function Back({ path }: IProps) {
  return (
    <Link href={path}>
      <div className="flex gap-2 mb-5">
        <ArrowLeft
          size={25}
          strokeWidth={2}
          className="cursor-pointer opacity-70 hover:opacity-100"
        />
        <span> Back</span>
      </div>
    </Link>
  );
}

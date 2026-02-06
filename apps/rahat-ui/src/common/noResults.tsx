'use-client';
import React from 'react';

import { Search } from 'lucide-react';
import { cn } from '@rahat-ui/shadcn/src';

interface Iprops {
  message?: string;
  size?: 'small' | 'large';
  className?: string;
}
export function NoResult({ message, size = 'large', className }: Iprops) {
  return (
    <div className={cn("flex flex-col justify-center items-center mt-10", className)}>
      <Search
        className={`text-muted-foreground ${
          size === 'small' ? 'h-7 w-7 mb-1' : 'h-12 w-12 mb-4'
        }`}
      />
      <p
        className={`text-center text-muted-foreground ${
          size === 'small' ? 'text-base font-medium' : 'text-lg font-semibold'
        }`}
      >
        {message ? message : 'No results found'}
      </p>
    </div>
  );
}

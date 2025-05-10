'use-client';
import React from 'react';

import { Search } from 'lucide-react';

interface Iprops {
  message?: string;
}
export function NoResult({ message }: Iprops) {
  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <Search className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-center text-lg text-muted-foreground font-semibold">
        {message ? message : 'No results found'}
      </p>
    </div>
  );
}

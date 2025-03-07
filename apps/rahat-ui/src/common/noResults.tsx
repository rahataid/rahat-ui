'use-client';
import React from 'react';

import { Search } from 'lucide-react';

export function NoResult() {
  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <Search className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-center text-lg text-muted-foreground font-semibold">
        No results found
      </p>
    </div>
  );
}

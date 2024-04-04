import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Search } from 'lucide-react';
import React from 'react';

const Filters = () => {
  return (
    <div className="flex relative w-full">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input placeholder="Search" className="pl-8 rounded" />
    </div>
  );
};

export default Filters;

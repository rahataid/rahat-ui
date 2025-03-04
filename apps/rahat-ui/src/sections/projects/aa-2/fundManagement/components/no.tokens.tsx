import React from 'react';
import { Info } from 'lucide-react';

export default function NoTokens() {
  return (
    <div className="p-4 border rounded-md flex flex-col space-y-2 items-center">
      <div className="p-4 rounded-full bg-red-50">
        <Info color="red" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-xl/6">Not enough tokens</p>
        <p className="text-sm/6 text-muted-foreground">
          There are not enough tokens
        </p>
      </div>
    </div>
  );
}

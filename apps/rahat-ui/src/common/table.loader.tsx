import React from 'react';

export function TableLoader() {
  return (
    <div className="flex items-center justify-center space-x-2 h-full">
      <div className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></div>
      <div className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.13s]"></div>
      <div className="h-3 w-3 animate-bounce rounded-full bg-primary"></div>
    </div>
  );
}

import React from 'react';
import { ScrollArea } from '@rahat-ui/shadcn/components/scroll-area';
import TargetSelectForm from './TargetSelectForm';

export default function Nav() {
  return (
    <>
      <div>
        <div className="flex justify-between items-center p-4 border-6">
          <h1 className="font-semibold text-xl text-primary">Targeting</h1>
        </div>
        <div className="px-4">
          <ScrollArea className="h-auto mb-4">
            <TargetSelectForm />
          </ScrollArea>
        </div>
      </div>
    </>
  );
}

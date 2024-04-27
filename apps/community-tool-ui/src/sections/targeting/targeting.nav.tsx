import React from 'react';
import { ScrollArea } from '@rahat-ui/shadcn/components/scroll-area';
import TargetSelectForm from './TargetSelectForm';
import { ITargetingQueries } from '../../types/targeting';

type IProps = {
  onFormSubmit: (formData: ITargetingQueries) => Promise<void>;
};

export default function Nav({ onFormSubmit }: IProps) {
  return (
    <>
      <div>
        <div className="flex justify-between items-center p-4 border-6">
          <h1 className="font-semibold text-xl text-primary">Targeting</h1>
        </div>
        <div className="px-4">
          <ScrollArea className="h-auto m-4">
            <TargetSelectForm onFormSubmit={onFormSubmit} />
          </ScrollArea>
        </div>
      </div>
    </>
  );
}

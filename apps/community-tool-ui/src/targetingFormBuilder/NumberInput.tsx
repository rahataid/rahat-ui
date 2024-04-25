import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import React from 'react';
import useTargetingFormStore from './form.store';
import { humanizeString } from '../utils';

export default function NumberInput({ formField }: any) {
  const { targetingQueries, setTargetingQueries }: any =
    useTargetingFormStore();

  const handleInputChange = (e: any) => {
    let item = {} as any;
    item[formField.name] = e.target.value;
    const formData = { ...targetingQueries, ...item };
    setTargetingQueries(formData);
  };

  const defaultData = targetingQueries[formField.name] || '';

  return (
    <div>
      <Label>{humanizeString(formField.name)}</Label>
      <Input
        value={defaultData}
        type="number"
        onChange={handleInputChange}
        className="w-80"
      />
    </div>
  );
}

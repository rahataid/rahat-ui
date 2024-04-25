import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import React from 'react';
import useTargetingFormStore from './form.store';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { humanizeString } from '../utils';

export default function TextAreaInput({ formField }: any) {
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
      <Textarea value={defaultData} onChange={handleInputChange} />
    </div>
  );
}

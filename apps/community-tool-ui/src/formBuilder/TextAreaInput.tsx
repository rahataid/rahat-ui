import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import React from 'react';
import useFormStore from './form.store';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { humanizeString } from '../utils';

export default function TextAreaInput({ formField }: any) {
  const { extras, setExtras }: any = useFormStore();

  const handleInputChange = (e: any) => {
    let item = {} as any;
    item[formField.name] = e.target.value;
    const formData = { ...extras, ...item };
    setExtras(formData);
  };

  const defaultData = extras[formField.name] || '';

  return (
    <div>
      <Label>{humanizeString(formField.name)}</Label>
      <Textarea value={defaultData} onChange={handleInputChange} />
    </div>
  );
}

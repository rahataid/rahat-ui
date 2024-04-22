import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import React from 'react';
import useFormStore from './form.store';
import { humanizeString } from '../utils';

export default function TextInput({ formField }: any) {
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
      <Input value={defaultData} type="text" onChange={handleInputChange} />
    </div>
  );
}

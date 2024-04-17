import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import React from 'react';
import useFormStore from './form.store';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { FormLabel } from '@rahat-ui/shadcn/src/components/ui/form';

export default function CheckboxInput({ formField }: any) {
  const { extras, setExtras }: any = useFormStore();
  const handleInputChange = (e: any) => {
    let item = {} as any;
    item[formField.name] = e.target.value;
    const formData = { ...extras, ...item };
    setExtras(formData);
  };
  return (
    <div>
      <Label>{formField.name}</Label> <br />
      <Checkbox checked={false} onCheckedChange={handleInputChange} />{' '}
      <FormLabel className="font-normal">Option 1</FormLabel>
    </div>
  );
}

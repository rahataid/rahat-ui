import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import React from 'react';
import useFormStore from './form.store';
import {
  RadioGroup,
  RadioGroupItem,
} from '@rahat-ui/shadcn/src/components/ui/radio-group';

export default function RadioInput({ formField }: any) {
  const { extras, setExtras }: any = useFormStore();
  const handleInputChange = (e: any) => {
    let item = {} as any;
    item[formField.name] = e.target.value;
    const formData = { ...extras, ...item };
    setExtras(formData);
  };
  return (
    <div>
      <Label>{formField.name}</Label>
      <RadioGroup>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-one" id="option-one" />
          <Label htmlFor="option-one">Option One</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-one" id="option-one" />
          <Label htmlFor="option-one">Option Two</Label>
        </div>
      </RadioGroup>
    </div>
  );
}

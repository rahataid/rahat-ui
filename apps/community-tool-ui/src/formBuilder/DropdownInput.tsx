import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import React from 'react';
import useFormStore from './form.store';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { humanizeString } from '../utils';

export default function DropDownInput({ formField }: any) {
  const { extras, setExtras }: any = useFormStore();

  const handleInputChange = (d: string) => {
    let item = {} as any;
    item[formField.name] = d;
    const formData = { ...extras, ...item };
    setExtras(formData);
  };

  return (
    <div>
      <Label>{humanizeString(formField.name)}</Label>
      <Select onValueChange={handleInputChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{humanizeString(formField.name)}</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

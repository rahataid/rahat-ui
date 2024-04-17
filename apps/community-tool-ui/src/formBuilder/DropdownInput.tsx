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

  const options = formField?.fieldPopulate?.data || ([] as any);

  return (
    <div>
      <Label>{humanizeString(formField.name)}</Label>
      <Select onValueChange={handleInputChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.length > 0
              ? options.map((d: any) => {
                  return (
                    <SelectItem value={d.value}>
                      {humanizeString(d.label)}
                    </SelectItem>
                  );
                })
              : 'No Options'}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

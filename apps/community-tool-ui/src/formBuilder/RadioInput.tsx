import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import React from 'react';
import useFormStore from './form.store';
import {
  RadioGroup,
  RadioGroupItem,
} from '@rahat-ui/shadcn/src/components/ui/radio-group';
import { humanizeString } from '../utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

export default function RadioInput({ formField }: any) {
  const { extras, setExtras }: any = useFormStore();

  const handleInputChange = (e: any) => {
    const { value } = e.target as any;
    if (!value) return;
    let item = {} as any;
    item[formField.name] = value;
    const formData = { ...extras, ...item };
    setExtras(formData);
  };

  const options = formField?.fieldPopulate?.data || ([] as any);
  const defaultData = extras[formField.name] || '';

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Label>{humanizeString(formField.name)}</Label>
          </TooltipTrigger>
          <TooltipContent>
            <p>{formField.name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <RadioGroup value={defaultData} onChange={handleInputChange}>
        {options.length > 0 ? (
          options.map((d: any) => {
            return (
              <div key={d.value} className="flex items-center space-x-2">
                <RadioGroupItem value={d.value} id={d.value} />
                <Label htmlFor={d.value}>{d.label}</Label>
              </div>
            );
          })
        ) : (
          <p>No options!</p>
        )}
      </RadioGroup>
    </div>
  );
}

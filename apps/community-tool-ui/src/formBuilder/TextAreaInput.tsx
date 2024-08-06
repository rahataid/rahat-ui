import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import React from 'react';
import useFormStore from './form.store';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { humanizeString } from '../utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

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
      <Textarea value={defaultData} onChange={handleInputChange} />
    </div>
  );
}

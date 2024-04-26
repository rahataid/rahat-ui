import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import React from 'react';
import useTargetingFormStore from './form.store';
import {
  RadioGroup,
  RadioGroupItem,
} from '@rahat-ui/shadcn/src/components/ui/radio-group';
import { humanizeString } from '../utils';

export default function RadioInput({ formField }: any) {
  const { targetingQueries, setTargetingQueries }: any =
    useTargetingFormStore();

  const handleInputChange = (e: any) => {
    const { value } = e.target as any;
    if (!value) return;
    let item = {} as any;
    item[formField.name] = value;
    const formData = { ...targetingQueries, ...item };
    setTargetingQueries(formData);
  };

  const options = formField?.fieldPopulate?.data || ([] as any);
  const defaultData = targetingQueries[formField.name] || '';

  return (
    <div>
      <Label>{humanizeString(formField.name)}</Label>
      <RadioGroup
        value={defaultData}
        onChange={handleInputChange}
        className="w-80"
      >
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

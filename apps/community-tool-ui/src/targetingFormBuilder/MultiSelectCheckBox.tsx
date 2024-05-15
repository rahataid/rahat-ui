import React, { useState } from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@rahat-ui/shadcn/src/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';

import { humanizeString } from '../utils';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import useTargetingFormStore from './form.store';

type IProps = {
  formField?: any;
  defaultOptions?: any;
  defaultLabel?: string;
  defaultName?: string;
};

function MultiSelectCheckBox({
  formField,
  defaultOptions,
  defaultLabel,
  defaultName,
}: IProps) {
  const [checkedValues, setCheckedValues] = useState<any>({});

  const { targetingQueries, setTargetingQueries }: any =
    useTargetingFormStore();

  function handleCheckedChange(checked: boolean, data: any) {
    const fieldName = formField ? formField.name : defaultLabel;

    const updatedCheckedValues = {
      ...checkedValues,
      [data.value]: checked,
    };
    setCheckedValues(updatedCheckedValues);

    const item: any = {};

    if (formField) {
      const existing = targetingQueries[fieldName];
      const arrData = existing ? existing.split(',') : [];
      const updatedData = checked
        ? [...arrData, data.value]
        : arrData.filter((f: any) => f !== data.value);
      item[fieldName] = updatedData.join(',');
    }

    if (defaultOptions && defaultName) {
      const existingDefault = targetingQueries[defaultName];
      const arrDefaultData = existingDefault ? existingDefault.split(',') : [];
      const updatedDefaultData = checked
        ? [...arrDefaultData, data.value]
        : arrDefaultData.filter((f: any) => f !== data.value);
      targetingQueries[defaultName] = updatedDefaultData.join(',');
      item[defaultName] = updatedDefaultData.join(',');
    }

    const formData = { ...targetingQueries, ...item };
    setTargetingQueries(formData);
  }

  const options = formField?.fieldPopulate?.data || defaultOptions;

  return (
    <>
      <FormItem className="mt-4">
        <FormLabel>
          {formField ? humanizeString(formField.name) : defaultLabel}
        </FormLabel>
        <Select>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="--Select Option--" />
            </SelectTrigger>
          </FormControl>

          <SelectContent>
            {options?.length > 0
              ? options.map((item: any) => (
                  <FormField
                    key={item.value}
                    name={formField ? formField.name : defaultLabel}
                    render={({ field }: any) => {
                      return (
                        <FormItem
                          key={item.value}
                          className="flex flex-row items-start space-x-3 space-y-0 mt-2"
                        >
                          <FormControl>
                            <Checkbox
                              checked={
                                checkedValues[item.value] ||
                                field.value?.includes(item.value)
                              }
                              onCheckedChange={(checked: boolean) =>
                                handleCheckedChange(checked, item)
                              }
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))
              : 'No Options'}
          </SelectContent>
        </Select>
      </FormItem>
    </>
  );
}

export default MultiSelectCheckBox;

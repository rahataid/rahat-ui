'use client';
import React from 'react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Form, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Minus, Plus } from 'lucide-react';

export default function AddSetting() {
  const FormSchema = z.object({
    name: z.string(),
    field: z.array(
      z.object({
        value: z.object({
          key: z.string(),
          value: z.string(),
        }),
      }),
    ),
    requiredFields: z.array(z.string()),
  });
  const { handleSubmit, control } = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      name: '',
      requiredFields: [''],
      field: [{ value: { key: '', value: '' } }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    name: 'field',
    control: control,
    rules: {
      required: 'Please append at least 1 item',
    },
  });

  const appendField = () => {
    append({
      value: { key: '', value: '' },
    });
  };
  const handleAddSetting = async (data: z.infer<typeof FormSchema>) => {
    const result = data.field.reduce(
      (acc: any, item: any) => {
        acc.value[item.value.key] = item.value.value;
        return acc;
      },
      { value: {} },
    );

    const finalSettingData = {
      name: data.name,
      requiredFields: data.requiredFields,
      value: result.value,
    };
    console.log('Form Data:', finalSettingData, typeof data.requiredFields);
  };
  return (
    <form onSubmit={handleSubmit(handleAddSetting)}>
      <div className="p-4 h-add">
        <h1 className="text-lg font-semibold mb-6">Add Settings</h1>
        <div className="shadow-md p-4 rounded-sm">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label
                htmlFor="name"
                className="block text-base font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <Input type="text" placeholder="Name" {...field} />
                )}
              />
            </div>
            <div>
              <label
                htmlFor="requiredFields"
                className="block text-base font-medium text-gray-700 mb-1"
              >
                Required fields{' '}
                <span className="text-xs font-light text-gray-500 text-opacity-75">
                  {' '}
                  should be seprated by comma for different value
                </span>
              </label>
              <FormField
                control={control}
                name="requiredFields"
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="SAME AS KEY eg: CLIENT_ID "
                    {...field}
                    onChange={(e) => {
                      const uppercaseValue = e.target.value.toUpperCase();
                      field.onChange(
                        uppercaseValue.split(',').map((item) => item.trim()), // Remove leading and trailing whitespaces
                      );
                    }}
                  />
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <label>KEY</label>
            <label>VALUE</label>
          </div>
          <div className="grid grid-cols-5 gap-5 mb-4">
            {fields.map((fieldName, index) => {
              return (
                <React.Fragment key={index}>
                  <FormField
                    control={control}
                    name={`field.${index}.value.key`}
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder="eg:Client-ID"
                        className="col-span-2"
                        {...field}
                        // value={field.value}
                      />
                    )}
                  />
                  <FormField
                    control={control}
                    name={`field.${index}.value.value`}
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder="Value"
                        className="col-span-2"
                        {...field}
                        // value={field.value}
                      />
                    )}
                  />

                  <div className="flex justify-center">
                    <Button
                      type="button"
                      onClick={() => remove(index)}
                      className=" p-1 text-xs  w-10"
                    >
                      <Minus size={18} strokeWidth={1.5} />
                    </Button>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          <Button onClick={appendField} className="flex items-center gap-2">
            <Plus size={18} strokeWidth={1.5} />
            Add Field
          </Button>
          <div className="flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        </div>
      </div>
    </form>
  );
}

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
import { useRumsanService } from '../../providers/service.provider';
import { Switch } from '@rahat-ui/shadcn/src/components/ui/switch';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';

export default function AddSetting() {
  const { communitySettingQuery } = useRumsanService();
  const communitySetting = communitySettingQuery.useCommunitySettingCreate();
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
    isReadOnly: z.boolean(),
    isPrivate: z.boolean(),
  });
  const { handleSubmit, control } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      requiredFields: [''],
      field: [{ value: { key: '', value: '' } }],
      isPrivate: true,
      isReadOnly: false,
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
      isReadOnly: data.isReadOnly,
      isPrivate: data.isPrivate,
    };
    await communitySetting.mutateAsync(finalSettingData);
  };

  return (
    <form onSubmit={handleSubmit(handleAddSetting)}>
      <div className="p-4 h-add">
        <h1 className="text-lg font-semibold mb-6">Add Settings</h1>
        <div className="shadow-md p-4 rounded-sm">
          <div className="grid grid-cols-5 gap-4 mb-4">
            <div className="col-span-2">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <>
                    <Label>Name</Label>
                    <Input type="text" placeholder="Name" {...field} />
                  </>
                )}
              />
            </div>
            <div className="col-span-2">
              <FormField
                control={control}
                name="requiredFields"
                render={({ field }) => (
                  <>
                    <Label>
                      RequiredFields{' '}
                      <span className="text-sm text-muted-foreground">
                        {' '}
                        should be seprated by comma for different value
                      </span>
                    </Label>
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
                  </>
                )}
              />
            </div>

            {/* <div className="col-span-1 flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <FormField
                  control={control}
                  name="isReadOnly"
                  render={({ field }) => (
                    <Switch
                      {...field}
                      value={field.value ? 'false' : 'true'}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label>ReadOnly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <FormField
                  control={control}
                  name="isPrivate"
                  render={({ field }) => (
                    <Switch
                      {...field}
                      value={field.value ? 'true' : 'false'}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label>Private</Label>
              </div>
            </div> */}
            <div className="col-span-1 flex flex-col items-center col space-y-3 mt-3">
              <div className="flex flex-row items-center space-x-3 space-y-2">
                <FormField
                  control={control}
                  name="isReadOnly"
                  render={({ field }) => (
                    <>
                      <Label>ReadOnly</Label>
                      <Switch
                        {...field}
                        value={field.value ? 'false' : 'true'}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </>
                  )}
                />
              </div>
              <div className="flex flex-row items-center space-x-2">
                <FormField
                  control={control}
                  name="isPrivate"
                  render={({ field }) => (
                    <>
                      <Label>Private</Label>
                      <Switch
                        {...field}
                        value={field.value ? 'true' : 'false'}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </>
                  )}
                />
              </div>
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

          <Button
            onClick={appendField}
            type="button"
            className="flex items-center gap-2"
          >
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

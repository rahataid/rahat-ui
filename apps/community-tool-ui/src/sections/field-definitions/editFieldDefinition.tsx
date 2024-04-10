'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { useForm } from 'react-hook-form';

import { z } from 'zod';
import { FieldType } from '../../types/fieldDefinition';

import { FieldDefinition } from '@rahataid/community-tool-sdk/fieldDefinitions';
import {
  useFieldDefinitionsUpdate,
  // useFieldDefinitionsStatusUpdate,
} from '@rahat-ui/community-query';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Switch } from '@rahat-ui/shadcn/src/components/ui/switch';
import React from 'react';

export default function EditFieldDefinition({
  data,
}: {
  data: FieldDefinition;
}) {
  const updateFieldDefinition = useFieldDefinitionsUpdate();
  // const updateFieldDefinitionStatus = useFieldDefinitionsStatusUpdate();

  const FormSchema = z.object({
    name: z.string(),
    fieldType: z.string().toUpperCase(),
    isActive: z.boolean(),
    isTargeting: z.boolean(),
    fieldPopulate: z.array(
      z.object({
        key: z.string(),
        value: z.string(),
      }),
    ),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: data?.name || '',
      fieldType: data?.fieldType || '',
      isActive: data?.isActive || false,
      isTargeting: data?.isTargeting || false,
      fieldPopulate: data?.fieldPopulate?.data || [],
    },
  });

  const handleEditFieldDefinition = async (
    formData: z.infer<typeof FormSchema>,
  ) => {
    await updateFieldDefinition.mutateAsync({
      id: data?.id?.toString(),
      data: {
        name: formData?.name,
        fieldType: formData?.fieldType as FieldType,
        isActive: formData?.isActive,
        isTargeting: formData?.isTargeting,
        fieldPopulate: { data: formData.fieldPopulate },
      },
    });
  };

  // const handleStatusChange = async (isActive: any) => {
  //   await updateFieldDefinitionStatus.mutateAsync({
  //     id: data?.id?.toString() as string,
  //     isActive: isActive,
  //   });
  // };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleEditFieldDefinition)}>
        <div className="p-4 h-add overflow-scroll">
          <h1 className="text-lg font-semibold mb-6">
            Update Field Definition
          </h1>
          <div className="shadow-md p-4 rounded-sm">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Label className="text-xs font-medium">Name</Label>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Name"
                          {...field}
                          onChange={(e) => {
                            form.setValue('name', e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="fieldType"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Label className="text-xs font-medium">Field Type</Label>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Field Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={FieldType.TEXT}>TEXT</SelectItem>
                          <SelectItem value={FieldType.NUMBER}>
                            NUMBER
                          </SelectItem>
                          <SelectItem value={FieldType.CHECKBOX}>
                            CHECKBOX
                          </SelectItem>
                          <SelectItem value={FieldType.DROPDOWN}>
                            DROPDOWN
                          </SelectItem>
                          <SelectItem value={FieldType.PASSWORD}>
                            PASSWORD
                          </SelectItem>
                          <SelectItem value={FieldType.RADIO}>RADIO</SelectItem>
                          <SelectItem value={FieldType.TEXTAREA}>
                            TEXTAREA
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <div className="flex flex-col items-left">
                    <Label className="text-xs font-medium">isActive</Label>
                    <Switch
                      {...field}
                      value={field.value ? 'false' : 'true'}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      // onCheckedChange={(isChecked) => {
                      //   handleStatusChange({
                      //     isActive: isChecked,
                      //   });
                      // }}
                    />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="isTargeting"
                render={({ field }) => (
                  <div className="flex flex-col items-right">
                    <Label className="text-xs font-medium">
                      User for Targeting
                    </Label>
                    <Switch
                      {...field}
                      value={field.value ? 'false' : 'true'}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />
            </div>
            {form.getValues('fieldPopulate')?.length > 0 && (
              <div className="mt-5 mb-2 over">
                <Label className="text-xs font-medium mt-2">
                  Field Populate
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {form
                    .watch('fieldPopulate')
                    .map((item: any, index: number) => (
                      <React.Fragment key={index}>
                        <FormField
                          control={form.control}
                          name={`fieldPopulate.${index}.key`}
                          render={({ field }) => (
                            <FormItem>
                              <Label className="text-xs font-medium">{`Field ${
                                index + 1
                              } Key`}</Label>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder={`Field ${index + 1} Key`}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`fieldPopulate.${index}.value`}
                          render={({ field }) => (
                            <FormItem>
                              <Label className="text-xs font-medium">{`Field ${
                                index + 1
                              } Value`}</Label>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder={`Field ${index + 1} Value`}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </React.Fragment>
                    ))}
                </div>
              </div>
            )}
            <div className="flex justify-end mb-10">
              <Button>Update Field Definition</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

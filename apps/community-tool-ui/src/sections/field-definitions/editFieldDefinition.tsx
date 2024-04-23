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
import { useForm, useFieldArray } from 'react-hook-form';

import { z } from 'zod';
import { FieldType } from '../../types/fieldDefinition';

import { FieldDefinition } from '@rahataid/community-tool-sdk/fieldDefinitions';
import {
  useFieldDefinitionsUpdate,
  // useFieldDefinitionsStatusUpdate,
} from '@rahat-ui/community-query';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Switch } from '@rahat-ui/shadcn/src/components/ui/switch';
import React, { useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';

export default function EditFieldDefinition({
  data,
}: {
  data: FieldDefinition;
}) {
  const updateFieldDefinition = useFieldDefinitionsUpdate();

  const [showLabelValue, setShowLabelValue] = useState(false);

  const FormSchema = z.object({
    name: z.string(),
    fieldType: z.string().toUpperCase(),
    isActive: z.boolean(),
    isTargeting: z.boolean(),
    fieldPopulate: z.array(
      z.object({
        label: z.string(),
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

  const { fields, append, remove } = useFieldArray({
    name: 'fieldPopulate',
    control: form.control,
  });

  const addLabelAndValue = () => {
    if (showLabelValue) {
      append({ label: '', value: '' });
    }
  };

  const handleEditFieldDefinition = async (
    formData: z.infer<typeof FormSchema>,
  ) => {
    let fieldPopulateBody: Array<{ label: string; value: string }> | [] = [];
    if (!showLabelValue) {
      fieldPopulateBody = [];
    } else {
      fieldPopulateBody = formData?.fieldPopulate;
    }

    await updateFieldDefinition.mutateAsync({
      id: data?.id?.toString(),
      data: {
        name: formData?.name,
        fieldType: formData?.fieldType as FieldType,
        isActive: formData?.isActive,
        isTargeting: formData?.isTargeting,
        fieldPopulate: { data: fieldPopulateBody },
      },
    });
  };

  useEffect(() => {
    setShowLabelValue(
      form.watch('fieldType') === FieldType.CHECKBOX ||
        form.watch('fieldType') === FieldType.RADIO ||
        form.watch('fieldType') === FieldType.DROPDOWN,
    );
  }, [form.watch('fieldType'), form]);

  useEffect(() => {
    if (showLabelValue) {
      if (fields.length === 0) {
        append({ label: '', value: '' });
      }
    }
  }, [showLabelValue, fields, append, form]);

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
                          <>
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
                            <SelectItem value={FieldType.RADIO}>
                              RADIO
                            </SelectItem>

                            <SelectItem value={FieldType.TEXTAREA}>
                              TEXTAREA
                            </SelectItem>
                          </>
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
                    <Label className="text-xs font-medium mb-1">isActive</Label>
                    <Switch
                      {...field}
                      value={field.value ? 'false' : 'true'}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="isTargeting"
                render={({ field }) => (
                  <div className="flex flex-col items-right">
                    <Label className="text-xs font-medium mb-1">
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

            {showLabelValue && form.getValues('fieldPopulate')?.length > 0 && (
              <div>
                <Label className="text-xs font-medium mt-2">
                  Field Populate
                </Label>
                <div className="grid gap-3">
                  {form
                    .watch('fieldPopulate')
                    .map((item: any, index: number) => (
                      <div key={index} className="flex items-center">
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name={`fieldPopulate.${index}.label`}
                            render={({ field }) => (
                              <FormItem>
                                <Label className="text-xs font-medium">
                                  Label
                                </Label>
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder="Label"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex-1 ml-2">
                          <FormField
                            control={form.control}
                            name={`fieldPopulate.${index}.value`}
                            render={({ field }) => (
                              <FormItem>
                                <Label className="text-xs font-medium">
                                  Value
                                </Label>
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder="Value"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div>
                          <Button
                            type="button"
                            onClick={() => remove(index)}
                            className="mt-8 ml-3 text-xs"
                            // disabled={fields.length === 1}
                          >
                            <Minus size={10} strokeWidth={1.5} />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="flex justify-start mb-4">
                  <Button
                    onClick={addLabelAndValue}
                    type="button"
                    className="flex items-center p-2 gap-1 text-xs mt-3"
                  >
                    <Plus size={18} strokeWidth={1.5} />
                    Add Field
                  </Button>
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

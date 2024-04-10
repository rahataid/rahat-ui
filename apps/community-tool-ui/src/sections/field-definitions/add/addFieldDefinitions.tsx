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
import { toast } from 'react-toastify';
import { Switch } from '@rahat-ui/shadcn/src/components/ui/switch';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';

import { z } from 'zod';

import React, { useEffect, useState } from 'react';

import { useFieldDefinitionsCreate } from '@rahat-ui/community-query';
import { FieldType } from 'apps/community-tool-ui/src/types/fieldDefinition';
import { Minus, Plus } from 'lucide-react';

export default function AddFieldDefinitions() {
  const addFieldDefinitions = useFieldDefinitionsCreate();
  const [showKeyValueFields, setShowKeyValueFields] = useState(false);
  const {
    control,
    formState: { errors },
  } = useForm();

  const FormSchema = z.object({
    name: z.string().min(1),
    fieldType: z.string().toUpperCase(),
    isActive: z.boolean(),
    isTargeting: z.boolean(),
    field: z.array(
      z.object({
        value: z.object({
          key: z.string().min(1, { message: 'Key is required' }),
          value: z.string().min(1, { message: 'Value is required' }),
        }),
      }),
    ),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      fieldType: FieldType.TEXT,
      isActive: true,
      isTargeting: false,
      field: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'field',
    control: control,
  });

  const handleCreateFieldDefinitions = async (
    data: z.infer<typeof FormSchema>,
  ) => {
    let fieldPopulatePayload;
    if (data.field && data.field.length > 0) {
      fieldPopulatePayload = data.field.map((item: any) => ({
        key: item.value.key,
        value: item.value.value,
      }));
    }

    try {
      const payload = {
        name: data.name,
        fieldType: data.fieldType as FieldType,
        isActive: true,
        isTargeting: data.isTargeting,
        fieldPopulate: { data: fieldPopulatePayload } || [],
      };

      await addFieldDefinitions.mutateAsync(payload);
    } catch (error) {
      toast.error('Error creating Field Definition');
      console.error('Error creating Field Definition:', error);
    }
  };

  const addKeyValueField = () => {
    if (showKeyValueFields) {
      append({
        value: { key: '', value: '' },
      });
    }
  };

  useEffect(() => {
    setShowKeyValueFields(
      form.watch('fieldType') === FieldType.CHECKBOX ||
        form.watch('fieldType') === FieldType.RADIO ||
        form.watch('fieldType') === FieldType.DROPDOWN,
    );
  }, [form.watch('fieldType'), form]);

  useEffect(() => {
    if (addFieldDefinitions.isSuccess) {
      form.reset();
    }
  }, [addFieldDefinitions.isSuccess, form]);

  useEffect(() => {
    if (showKeyValueFields) {
      if (fields.length === 0) {
        append({
          value: { key: '', value: '' },
        });
      }
    } else {
      form.setValue('field', []);
    }
  }, [showKeyValueFields, fields, append, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateFieldDefinitions)}>
        <div className="p-4 h-add">
          <h1 className="text-lg font-semibold mb-6">Add Field Definition</h1>
          <div className="shadow-md p-4 rounded-sm">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input type="text" placeholder="Name" {...field} />
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={FieldType.TEXT}
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
                name="isTargeting"
                render={({ field }) => (
                  <div className=" flex flex-row items-center gap-4 m-1">
                    <Label>User for Targeting</Label>
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
            {showKeyValueFields && (
              <>
                <div className="grid grid-cols-5 gap-4 mb-4">
                  <Label className="col-span-2">KEY</Label>
                  <Label className="col-span-2">VALUE</Label>
                </div>
                <div className="grid grid-cols-5 gap-5 mb-4">
                  {fields.map((fieldName, index) => {
                    return (
                      <React.Fragment key={index}>
                        <FormField
                          control={form.control}
                          name={`field.${index}.value.key` as const}
                          render={({ field }) => (
                            <div className="col-span-2">
                              <Input
                                type="text"
                                placeholder="eg: 1"
                                {...field}
                              />
                              {/* {errors?.fieldPopulate?.[index]?.value?.key && (
                                <Label className="text-red-500">
                                  {errors?.fieldPopulate?.[index]?.value?.key?.message}
                                </Label>
                              )} */}
                            </div>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`field.${index}.value.value` as const}
                          render={({ field }) => (
                            <div className="col-span-2">
                              <Input
                                type="text"
                                placeholder="eg: Green"
                                {...field}
                              />
                              {/* {errors?.fieldPopulate?.[index]?.value?.value && (
                                <Label className="text-red-500">
                                  {errors?.fieldPopulate?.[index]?.value?.value?.message}
                                </Label>
                              )} */}
                            </div>
                          )}
                        />

                        <div className="flex justify-center">
                          <Button
                            type="button"
                            onClick={() => remove(index)}
                            className="p-1 text-xs  w-10"
                            disabled={fields.length === 1}
                          >
                            <Minus size={18} strokeWidth={1.5} />
                          </Button>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>

                <Button
                  onClick={addKeyValueField}
                  type="button"
                  className="flex items-center p-2 gap-1 text-xs  w-15"
                >
                  <Plus size={18} strokeWidth={1.5} />
                  Add Field
                </Button>
              </>
            )}
            <div className="flex justify-end">
              <Button type="submit">Create Field Definition</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

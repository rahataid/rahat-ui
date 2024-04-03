'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { toast } from 'react-toastify';

import { z } from 'zod';
// import { CalendarIcon, Check, ChevronsUpDown, Wallet } from 'lucide-react';

import React, { useEffect } from 'react';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@rahat-ui/shadcn/src/components/ui/popover';
// import { format } from 'date-fns';
// import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { useFieldDefinitionsCreate } from '@rahat-ui/community-query';

export default function AddFieldDefinitions() {
  enum FieldType {
    CHECKBOX = 'CHECKBOX',
    DROPDOWN = 'DROPDOWN',
    NUMBER = 'NUMBER',
    PASSWORD = 'PASSWORD',
    RADIO = 'RADIO',
    TEXT = 'TEXT',
    TEXTAREA = 'TEXTAREA',
  }
  const addFieldDefinitions = useFieldDefinitionsCreate();
  const FormSchema = z.object({
    name: z.string(),
    fieldType: z.string().toUpperCase(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      fieldType: FieldType.TEXT,
    },
  });

  const handleCreateFieldDefinitions = async (
    data: z.infer<typeof FormSchema>,
  ) => {
    await addFieldDefinitions.mutateAsync({
      name: data.name,
      fieldType: data.fieldType as FieldType,
    });
  };

  useEffect(() => {
    if (addFieldDefinitions.isSuccess) {
      form.reset();
    }
  }, [addFieldDefinitions.isSuccess, form]);

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
            </div>
            <div className="flex justify-end">
              <Button>Create Field Definition</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

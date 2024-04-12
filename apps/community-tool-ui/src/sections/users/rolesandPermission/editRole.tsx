'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Input } from '@rahat-ui/shadcn/components/input';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/components/form';
import React, { useState } from 'react';
import { Switch } from '@rahat-ui/shadcn/src/components/ui/switch';
import { Role } from '@rumsan/sdk/types';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';

type Iprops = {
  roleDetail: Role;
};
export default function EditRole({ roleDetail }: Iprops) {
  const permissions = [
    {
      id: 'manage',
      label: 'Manage',
    },
    {
      id: 'create',
      label: 'Create',
    },
    {
      id: 'read',
      label: 'Read',
    },
    {
      id: 'update',
      label: 'Update',
    },
    {
      id: 'delete',
      label: 'Delete',
    },
  ] as const;

  const FormSchema = z.object({
    permission: z
      .array(z.string())
      .refine((value) => value.some((item) => item), {
        message: 'You have to select at least one permission.',
      }),
    subject: z.string().min(2, {
      message: 'Subject must be selected',
    }),
    roleName: z.string().min(2, {
      message: 'Role Name must be at least 2 characters.',
    }),
    isSystem: z.boolean(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      roleName: roleDetail?.name || '',
      isSystem: roleDetail?.isSystem || false,
      permission: [],
      subject: '',
    },
  });

  const handleEditRole = (data: any) => {
    const validateData = FormSchema.parse(data);

    const permissions = {
      [validateData.subject]: validateData.permission,
    };
    const k = {
      permissions,
    };
    console.log(k);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleEditRole)}>
        <h1 className="text-lg font-semibold mb-6">Edit Role</h1>
        <div className="p-4 rounded-sm">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <FormField
              control={form.control}
              name="roleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Role Name" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="isSystem"
            render={({ field }) => (
              <div className=" flex flex-col space-y-4">
                <FormLabel>System</FormLabel>
                <Switch
                  {...field}
                  value={field.value ? 'true' : 'false'}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />
          <FormField
            control={form.control}
            name="permission"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Permission</FormLabel>
                </div>
                {permissions.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="permission"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id,
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a respective subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ALL">All</SelectItem>
                    <SelectItem value="ROLE">ROLE</SelectItem>
                    <SelectItem value="PUBLIC">PUBLIC</SelectItem>
                    <SelectItem value="USER">USER</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit">Update Role</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

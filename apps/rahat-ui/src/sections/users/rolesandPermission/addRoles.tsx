'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Input } from '@rahat-ui/shadcn/components/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/components/form';
import React, { useState } from 'react';
import { Switch } from '@rahat-ui/shadcn/src/components/ui/switch';
import { useCreateRole } from '@rahat-ui/query';

export default function AddRoles() {
  const [roleName, setRoleName] = useState('');

  const createRole = useCreateRole();

  //   const permissions = [
  //     {
  //       id: 'manage',
  //       label: 'Manage',
  //     },
  //     {
  //       id: 'create',
  //       label: 'Create',
  //     },
  //     {
  //       id: 'read',
  //       label: 'Read',
  //     },
  //     {
  //       id: 'update',
  //       label: 'Update',
  //     },
  //     {
  //       id: 'delete',
  //       label: 'Delete',
  //     },
  //   ] as const;

  const FormSchema = z.object({
    roleName: z.string().min(2, {
      message: 'Role Name must be at least 2 characters.',
    }),
    isSystem: z.boolean(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      roleName: '',
      isSystem: false,
    },
  });

  const handleCreateRole = async (data: z.infer<typeof FormSchema>) => {
    const validateRoleName = data.roleName.split(' ').join('');
    createRole.mutateAsync({
      name: validateRoleName,
      isSystem: data?.isSystem,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateRole)}>
        <h1 className="text-lg font-semibold mb-6">Add Role</h1>
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
          {/* <FormField
            control={form.control}
            name="permissions"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Permission</FormLabel>
                </div>
                {permissions.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="permissions"
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
          /> */}
          <div className="flex justify-end">
            <Button type="submit">Create Role</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

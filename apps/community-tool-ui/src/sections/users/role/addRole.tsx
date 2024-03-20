'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@rahat-ui/shadcn/components/button';
import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
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
import { toast } from 'react-toastify';
import {
  ServiceContext,
  ServiceContextType,
} from 'apps/community-tool-ui/src/providers/service.provider';

export default function AddRole() {
  const [roleName, setRoleName] = useState('');

  const { roleQuery } = React.useContext(ServiceContext) as ServiceContextType;

  const createRole = roleQuery.userRoleCreate();

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
    permissions: z
      .array(z.string())
      .refine((value) => value.some((item) => item), {
        message: 'You have to select at least one permission.',
      }),
    roleName: z.string().min(2, {
      message: 'Role Name must be at least 2 characters.',
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      permissions: [''],
      roleName: '',
    },
  });

  const handleCreateRole = async (data: z.infer<typeof FormSchema>) => {
    console.log(data);

    createRole
      .mutateAsync({
        name: data.roleName,
        isSystem: false,
      })
      .then((data) => {
        if (data) {
          toast.success('Role Created Success.');
        }
      })
      .catch((e) => {
        toast.error(e);
      });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateRole)}
        className="space-y-8"
      >
        <div className="max-w-md mx-auto mt-8 p-6 bg-white ">
          <h2 className="text-2xl font-bold mb-4">Create New Role</h2>
          <div className="mb-4">
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
          />
          <Button className="bg-blue-500 mt-4 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Create Role
          </Button>
        </div>
      </form>
    </Form>
  );
}

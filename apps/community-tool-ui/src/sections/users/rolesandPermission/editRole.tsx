'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Input } from '@rahat-ui/shadcn/components/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useEditRole } from '@rahat-ui/community-query';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/components/form';
import { Switch } from '@rahat-ui/shadcn/src/components/ui/switch';
import { SUBJECT_ACTIONS } from 'apps/community-tool-ui/src/constants/app.const';
import { useSecondPanel } from 'apps/community-tool-ui/src/providers/second-panel-provider';
import { useEffect, useState } from 'react';
import swal from 'sweetalert2';
import PermissionsCard from './PermissionsCard';

type Iprops = {
  roleDetail: any;
  currentPerms: any;
};

export default function EditRole({ roleDetail, currentPerms }: Iprops) {
  const { closeSecondPanel } = useSecondPanel();
  const edit = useEditRole();

  const [selectedSubjectActions, setSeletedSubjectActions] =
    useState<any>(null);

  const FormSchema = z.object({
    roleName: z.string().min(2, {
      message: 'Role Name must be at least 2 characters.',
    }),
    isSystem: z.boolean().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      roleName: roleDetail?.data?.role?.name || '',
      isSystem: roleDetail?.data?.role?.isSystem || false,
    },
  });

  const handleEditRole = (data: any) => {
    const validateData = FormSchema.parse(data);
    const sanitizedPerms = filterNonEmptyArrays(selectedSubjectActions);
    const hasPerms = Object.keys(sanitizedPerms).length > 0;
    console.log({ hasPerms });
    if (!hasPerms)
      return swal.fire(
        'Error',
        'Please select at least one permission',
        'error',
      );
    const k = {
      name: validateData.roleName,
      isSystem: validateData.isSystem,
      permissions: sanitizedPerms,
    };
    edit.mutateAsync({ name: roleDetail?.data?.role?.name, data: k });
    closeSecondPanel();
  };

  const filterNonEmptyArrays = (obj: any) => {
    return Object.keys(obj)
      .filter((key) => obj[key].length > 0)
      .reduce((acc: any, key) => {
        acc[key] = obj[key];
        return acc;
      }, {});
  };

  const handlePermissionUpdate = (subject: string, action: string) => {
    setSeletedSubjectActions((prevPermissions: any) => {
      const currentPerms = prevPermissions[subject]
        ? prevPermissions[subject]
        : [];
      const updatedActions = currentPerms.includes(action)
        ? currentPerms.filter((a: string) => {
            return a !== action;
          })
        : [...currentPerms, action];

      return { ...prevPermissions, [subject]: updatedActions };
    });
  };

  useEffect(() => {
    setSeletedSubjectActions(currentPerms);
  }, [roleDetail.data.name]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleEditRole)}>
        <h1 className="text-lg font-semibold mb-6">Edit Role & Permissions</h1>
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

          <div className="mt-3 mb-5">
            <h2>Permissions</h2>
            {Object.keys(SUBJECT_ACTIONS).map((subject) => (
              <PermissionsCard
                key={subject}
                subject={subject}
                existingActions={
                  selectedSubjectActions && selectedSubjectActions[subject]
                    ? selectedSubjectActions[subject]
                    : []
                }
                onUpdate={handlePermissionUpdate}
              />
            ))}
          </div>

          <div className="flex justify-end mt-3">
            <Button type="submit">Update Role</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

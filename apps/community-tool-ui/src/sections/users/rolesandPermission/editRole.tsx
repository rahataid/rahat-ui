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
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Switch } from '@rahat-ui/shadcn/src/components/ui/switch';
import {
  SUBJECTS,
  PERMISSIONS,
} from 'apps/community-tool-ui/src/constants/app.const';
import { useSecondPanel } from 'apps/community-tool-ui/src/providers/second-panel-provider';

type Iprops = {
  roleDetail: any;
};

export default function EditRole({ roleDetail }: Iprops) {
  const { closeSecondPanel } = useSecondPanel();
  const edit = useEditRole();

  const FormSchema = z.object({
    permission: z
      .array(z.string())
      .refine((value) => value.some((item) => item), {
        message: 'You have to select at least one permission.',
      })
      .optional(),
    subject: z.string().min(2, {
      message: 'Subject must be selected',
    }),
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
      permission: [],
      subject: '',
    },
  });
  const handleEditRole = (data: any) => {
    const validateData = FormSchema.parse(data);

    const k = {
      name: validateData.roleName,
      isSystem: validateData.isSystem,
      permissions: {
        [validateData.subject]: validateData.permission,
      },
    };

    edit.mutateAsync({ name: roleDetail?.data?.role?.name, data: k });
    closeSecondPanel();
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
                    {SUBJECTS.map((item) => {
                      return (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="permission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Permission</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value[0]}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a permisssion" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {PERMISSIONS.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="permission"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0 mt-2"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.id,
                                        ])
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
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end mt-3">
            <Button type="submit">Update Role</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

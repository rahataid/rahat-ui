import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';

import { Role, User } from '@rumsan/sdk/types';
import { useRumsanService } from '../../providers/service.provider';
import { UUID } from 'crypto';
import { useEffect, useState } from 'react';

type IProps = {
  userData: User | undefined;
  handleClose: () => void;
};
export default function EditUser({ userData, handleClose }: IProps) {
  const { roleQuery, rumsanService } = useRumsanService();

  const { data: roleData } = roleQuery.userRoleList({});
  const roles: string[] =
    roleData?.data.map((role: Role) => role.name).sort() || [];

  const FormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 4 character' }),
    email: z.string(),
    roles: z.string().toUpperCase(),
    phone: z.string(),
    walletAddress: z
      .string()
      .min(42, { message: 'The Ethereum address must be 42 characters long' }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: userData?.name || '',
      email: userData?.email || '',
      roles: '',
      phone: userData?.phone || '',
      walletAddress: userData?.wallet || '',
    },
  });

  useEffect(() => {
    form.reset({
      name: userData?.name || '',
      email: userData?.email || '',
      roles: '',
      walletAddress: userData?.wallet || '',
      phone: userData?.phone || '',
    });
  }, [userData, form]);

  const handleEditUser = async (formData: any) => {
    const res = await rumsanService.client.patch(
      `/users/${userData?.uuid}`,
      formData,
    );
    res && handleClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleEditUser)}>
        <div className="p-4">
          <h1 className="text-md font-semibold mb-6">Update User</h1>
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
              name="email"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Input type="text" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Input type="text" placeholder="Phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="roles"
              render={({ field }) => {
                return (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {roles.length &&
                            roles.map((role) => (
                              <SelectItem value={role} key={role}>
                                {role}
                              </SelectItem>
                            ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="walletAddress"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Wallet Address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="flex justify-end">
            <Button>Update User</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

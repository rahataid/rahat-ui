'use client';

// Import statements
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useUserCreate, useUserRoleList } from '@rumsan/react-query';
import { enumToObjectArray } from '@rumsan/sdk/utils';
import { Role } from '@rumsan/sdk/types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Gender } from '@rahat-ui/types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

// Constants
const genderList = enumToObjectArray(Gender);

const FormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 4 character' }),
  email: z.string().email(),
  gender: z.string(),
  wallet: z
    .string()
    .min(42, { message: 'The Ethereum address must be 42 characters long' }),
});

// Component
export default function AddUser() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      gender: 'UNKNOWN',
      email: '',
      phone: '',
      role: 'USER',
      wallet: '',
    },
  });

  const { data: roleData } = useUserRoleList({});
  const roles = roleData?.data.map((role: Role) => role.name).sort() || [];
  const userCreate = useUserCreate();

  const handleAddUser = async () => {
    await userCreate.mutateAsync(form.getValues());
  };

  return (
    <Form {...form} onSubmit={form.handleSubmit(handleAddUser)}>
      <div className="p-4">
        <h1 className="text-md font-semibold mb-6">Add User</h1>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="text" placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => {
              return (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {genderList.map((gender) => (
                          <SelectItem value={gender.value} key={gender.value}>
                            {gender.label}
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
            name="role"
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
            name="wallet"
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
          <Button>Create User</Button>
        </div>
      </div>
    </Form>
  );
}

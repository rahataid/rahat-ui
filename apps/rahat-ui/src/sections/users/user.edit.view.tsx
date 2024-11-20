'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import {
  useRoleList,
  useSettingsStore,
  useUserCreate,
  useUserUpdate,
} from '@rahat-ui/query';
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
  useAddAdmin,
  useAddManager,
} from '../../hooks/el/contracts/el-contracts';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { PhoneInput } from '@rahat-ui/shadcn/src/components/ui/phone-input';
import HeaderWithBack from '../projects/components/header.with.back';
import { Loader2, Wallet } from 'lucide-react';
import {
  RadioGroup,
  RadioGroupItem,
} from '@rahat-ui/shadcn/src/components/ui/radio-group';
import { UUID } from 'crypto';
import { useUserEdit, useUserGet, useUserStore } from '@rumsan/react-query';

const FormSchema = z.object({
  name: z.string().min(4, { message: 'Name must be at least 4 character' }),
  email: z.string().email(),
  gender: z.string(),
  roles: z.array(z.string()).length(1, { message: 'Please select role' }),
  phone: z.string(),
  wallet: z
    .string()
    .min(42, { message: 'The Ethereum address must be 42 characters long' }),
});

// Component
export default function EditUser() {
  const { id } = useParams() as { id: UUID };
  const router = useRouter();
  const searchParam = useSearchParams();
  const role = searchParam.get('role');

  const { data } = useUserGet(id);
  const user = data?.data;

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      gender: '',
      email: '',
      phone: '',
      roles: [],
      wallet: '',
    },
  });

  const { reset } = form;
  React.useEffect(() => {
    if (user) {
      reset({
        name: user?.name?.toString(),
        gender: user?.gender?.toString(),
        email: user?.email?.toString(),
        phone: user?.phone?.toString(),
        roles: user?.roles,
        wallet: user?.wallet?.toString(),
      });
    }
  }, [user, reset]);

  const { data: roleData } = useRoleList();
  const updateUser = useUserUpdate(id);

  const handleEditUser = async (data: any) => {
    await updateUser.mutateAsync({
      uuid: id,
      payload: data,
    });
  };

  // const handleEditUser = async (data: z.infer<typeof FormSchema>) => {
  //   const payload = { uuid: User?.uuid, data: data };
  //   try {
  //     await updateUser.mutateAsync(payload);
  //   } catch (e) {
  //     console.error('Error updating user profile:', e);
  //     toast.error('Error updating user profile');
  //   }
  // };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleEditUser)}>
        <div className="p-4 h-[calc(100vh-130px)]">
          <HeaderWithBack
            title="Edit User"
            subtitle="Edit user detail"
            path="/users"
          />
          <div className="grid grid-cols-2 gap-4 border p-4 rounded-md">
            {role ? (
              <FormField
                control={form.control}
                name="roles"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Select
                        onValueChange={(value) => {
                          field.onChange([value]);
                        }}
                        defaultValue={field.value[0]}
                      >
                        <FormLabel>User Role</FormLabel>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select user role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {roleData?.data &&
                              roleData?.data?.map((role: any) => (
                                <SelectItem value={role.name} key={role.id}>
                                  {role.name}
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
            ) : (
              <>
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter user name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex space-x-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="MALE" />
                            </FormControl>
                            <FormLabel className="font-normal">Male</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="FEMALE" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Female
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="OTHER" />
                            </FormControl>
                            <FormLabel className="font-normal">Other</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="UNKNOWN" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Unknown
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <PhoneInput
                            placeholder="Enter phone number"
                            {...field}
                          />
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter email address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="wallet"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Wallet Address</FormLabel>
                          <FormControl>
                            <div className="relative w-full">
                              <Wallet className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="text"
                                placeholder="Enter wallet ddress"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-2 p-4 border-t">
          <Button
            className="px-14"
            type="button"
            variant="secondary"
            onClick={() => router.push('/users')}
          >
            Cancel
          </Button>
          {updateUser.isPending ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" className="px-10">
              Update
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

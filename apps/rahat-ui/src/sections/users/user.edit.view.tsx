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
import { useRoleList } from '@rahat-ui/query';
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
import { useParams, useRouter } from 'next/navigation';
import { PhoneInput } from '@rahat-ui/shadcn/src/components/ui/phone-input';
import HeaderWithBack from '../projects/components/header.with.back';
import { Loader2, Wallet } from 'lucide-react';
import {
  RadioGroup,
  RadioGroupItem,
} from '@rahat-ui/shadcn/src/components/ui/radio-group';
import { UUID } from 'crypto';
import { useUserGet, useUserEdit } from '@rumsan/react-query';
import { Gender } from '@rumsan/sdk/enums';
import Swal from 'sweetalert2';

const FormSchema = z.object({
  name: z.string().min(4, { message: 'Name must be at least 4 character' }),
  email: z.string().email(),
  gender: z.string(),
  // roles: z.array(z.string()).length(1, { message: 'Please select role' }),
  roles: z.array(z.string()).optional(),
  phone: z.string(),
  wallet: z
    .string()
    .min(42, { message: 'The Ethereum address must be 42 characters long' }),
});

// Component
export default function EditUser() {
  const { id } = useParams() as { id: UUID };
  const router = useRouter();

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
        roles: user?.UserRole?.map((r) => r?.Role?.name),
        wallet: user?.wallet?.toString(),
      });
    }
  }, [user, reset]);

  const { data: roleData } = useRoleList();
  const updateUser = useUserEdit();

  const handleEditUser = async (data: any) => {
    await updateUser.mutateAsync({
      uuid: id,
      data,
    });
    Swal.fire('User Updated Successfully', '', 'success');
    router.push('/users');
  };

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
                            <RadioGroupItem value={Gender.MALE} />
                          </FormControl>
                          <FormLabel className="font-normal">Male</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={Gender.FEMALE} />
                          </FormControl>
                          <FormLabel className="font-normal">Female</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={Gender.OTHER} />
                          </FormControl>
                          <FormLabel className="font-normal">Other</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={Gender.UKNOWN} />
                          </FormControl>
                          <FormLabel className="font-normal">Unknown</FormLabel>
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

              <FormField
                control={form.control}
                name="roles"
                render={({ field }) => {
                  return (
                    <FormItem className={field.value[0] ? 'block' : 'hidden'}>
                      <Select
                        onValueChange={(value) => {
                          field.onChange([value]);
                        }}
                        value={field.value[0]}
                        disabled
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
                            placeholder="Enter wallet address"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </>
          </div>
        </div>
        <div className="flex justify-end space-x-2 p-4 border-t">
          <Button
            className="px-14"
            type="button"
            variant="secondary"
            onClick={() => {
              form.reset();
              // router.push('/users')
            }}
          >
            Reset
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

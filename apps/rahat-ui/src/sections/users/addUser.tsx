'use client';

// Import statements
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
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
import { useRoleList, useSettingsStore } from '@rahat-ui/query';
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
import { useRouter } from 'next/navigation';
import { PhoneInput } from '@rahat-ui/shadcn/src/components/ui/phone-input';
import HeaderWithBack from '../projects/components/header.with.back';
import { Wallet } from 'lucide-react';
import {
  RadioGroup,
  RadioGroupItem,
} from '@rahat-ui/shadcn/src/components/ui/radio-group';
import { Gender } from '@rahataid/sdk/enums';
import { useUserCreate } from '@rumsan/react-query';
import Swal from 'sweetalert2';

const FormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 4 character' }),
  email: z.string().email(),
  gender: z.string().min(1, { message: 'Please select gender' }),
  roles: z.array(z.string()).length(1, { message: 'Please select role' }),
  phone: z.string(),
  wallet: z
    .string()
    .optional()
    .refine((val) => val === undefined || val === '' || val.length === 42, {
      message: 'The Ethereum address must be empty or 42 characters long',
    }),
});

// Component
export default function AddUser() {
  const router = useRouter();

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

  const { data: roleData } = useRoleList();
  const contractSettings = useSettingsStore((state) => state.accessManager);
  const roleSync = useSettingsStore((state) => state.roleOnChainSync);
  const route = useRouter();

  const userCreate = useUserCreate();
  const addManager = useAddManager();
  const addAdmin = useAddAdmin();

  const handleAddUser = async (data: any) => {
    try {
      if (roleSync === true) {
        if (data.roles.includes('Manager')) {
          await addManager.mutateAsync({
            data: data,
            walletAddress: data?.wallet,
            contractAddress: contractSettings as `0x${string}`,
          });
        } else if (data.roles.includes('Admin')) {
          await addAdmin.mutateAsync({
            data: data,
            walletAddress: data?.wallet,
            contractAddress: contractSettings as `0x${string}`,
          });
        } else {
          await userCreate.mutateAsync(data);
        }
      } else {
        await userCreate.mutateAsync(data);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred.';
      Swal.fire('User Creation Failed', errorMessage, 'error');
    }
  };

  useEffect(() => {
    if (userCreate.isSuccess) {
      Swal.fire('User Created Successfully', '', 'success');
      form.reset({
        name: '',
        gender: '',
        email: '',
        phone: '',
        roles: [],
        wallet: '',
      });
      route.push('/users');
    }
  }, [form, route, userCreate.isSuccess]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleAddUser)}>
        <div className="p-4 h-[calc(100vh-130px)]">
          <HeaderWithBack
            title="Create User"
            subtitle="Create a new user detail"
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
                        {Object.values(Gender).map((gender) => (
                          <FormItem
                            key={gender}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem value={gender} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {gender.charAt(0).toUpperCase() +
                                gender.slice(1).toLowerCase()}
                            </FormLabel>
                          </FormItem>
                        ))}
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
                    <FormItem>
                      <Select
                        onValueChange={(value) => {
                          field.onChange([value]);
                        }}
                        value={field.value[0] ?? ''}
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
                          <p className="text-xs text-amber-500 mt-2">
                            * Wallet address is required. If not entered, it
                            will be automatically filled.
                          </p>
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
            Clear
          </Button>
          <Button type="submit" className="px-10">
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
}

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

// Form validation schema
const FormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 4 characters' }),
  email: z.string().email(),
  gender: z.string().min(1, { message: 'Please select gender' }),
  roles: z.array(z.string()).length(1, { message: 'Please select role' }),
  phone: z.string(),
  wallet: z
    .string()
    .min(42, { message: 'The Ethereum address must be 42 characters long' }),
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
      router.push('/users');
    }
  }, [userCreate.isSuccess]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleAddUser)}>
        <div className="p-2 sm:p-4 h-[calc(100vh-130px)]">
          <HeaderWithBack
            title="Add User"
            subtitle="Create a new user detail"
            path="/users"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md">
            {/* User Name */}
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="w-full"
                      placeholder="Enter user name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender Selection */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
                            {gender}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <PhoneInput
                      className="w-full"
                      placeholder="Enter phone number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="w-full"
                      placeholder="Enter email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Wallet Address */}

            <FormField
              control={form.control}
              name="wallet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet Address</FormLabel>
                  <FormControl>
                    <div className="relative w-full">
                      <Wallet className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        className="w-full"
                        placeholder="Enter wallet address"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* User Role */}
            <FormField
              control={form.control}
              name="roles"
              render={({ field }) => (
                <FormItem>
                  <Select
                    disabled={!roleData?.data}
                    onValueChange={(value) => field.onChange([value])}
                    defaultValue={field.value[0]}
                  >
                    <FormLabel>User Role</FormLabel>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select user role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {roleData?.data?.map((role) => (
                          <SelectItem key={role.id} value={role.name}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-2 p-4 border-t">
          <Button
            className="w-full md:w-auto px-14"
            type="button"
            variant="secondary"
            onClick={() => router.push('/users')}
          >
            Cancel
          </Button>
          <Button
            className="text-white hover:text-blue-500 hover:border hover:border-blue-500 w-full md:w-auto px-10"
            type="submit"
          >
            Add
          </Button>
        </div>
      </form>
    </Form>
  );
}

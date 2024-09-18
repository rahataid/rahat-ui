'use client';

// Import statements
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// import { useUserCreate, useUserRoleList } from '@rumsan/react-query';
// import { enumToObjectArray } from '@rumsan/sdk/utils';
// import { Role } from '@rumsan/sdk/types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
// import { Gender } from '@rahat-ui/types';
import { useRoleList, useSettingsStore, useUserCreate } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  useAddAdmin,
  useAddManager,
} from '../../hooks/el/contracts/el-contracts';
import { useRouter } from 'next/navigation';
import { PhoneInput } from '@rahat-ui/shadcn/src/components/ui/phone-input';

// Constants
// const genderList = enumToObjectArray(Gender);

const FormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 4 character' }),
  email: z.string().email(),
  gender: z.string(),
  roles: z.array(z.string()).length(1, { message: 'Please select role' }),
  phone: z.string(),
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
  };

  useEffect(() => {
    if (userCreate.isSuccess) {
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
  }, [form, userCreate.isSuccess]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleAddUser)}>
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
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                        <SelectItem value="UNKNOWN">Unknown</SelectItem>
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
                      <PhoneInput placeholder="Phone" {...field} />
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
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
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
            {userCreate.isPending ? (
              <Button>
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />
              </Button>
            ) : (
              <Button>Create User</Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}

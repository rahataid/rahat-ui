'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useUpdateMe } from '@rahat-ui/community-query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Gender } from '@rahataid/community-tool-sdk/enums';
import { User } from '@rumsan/sdk/types';
import { use, useEffect, useMemo } from 'react';

type Iprops = {
  userDetail: User;
};
export default function EditProfile({ userDetail }: Iprops) {
  const updateUser = useUpdateMe();
  const FormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 4 character' }),
    email: z.string(),
    phone: z.string(),
    walletAddress: z.string(),
    gender: z
      .enum([Gender.MALE, Gender.FEMALE, Gender.OTHER, Gender.UKNOWN])
      .optional(),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: useMemo(
      () => ({
        name: userDetail?.name || '',
        email: userDetail?.email || '',
        phone: userDetail?.phone || '',
        walletAddress: userDetail?.wallet || '',
        gender: userDetail?.gender || Gender.UKNOWN,
      }),
      [userDetail],
    ),
  });

  const handleEditUser = async (data: any) => {
    await updateUser.mutateAsync({
      payload: {
        ...data,
        wallet: data?.walletAddress,
        phone: data?.phone,
        email: data?.email,
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleEditUser)}>
        <div className="h-add p-4">
          <h1 className="text-lg font-semibold mb-6">Edit Profile</h1>
          <div className="shadow-md p-4 rounded-sm grid grid-cols-md-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <Label>Name</Label>
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
                    <Label>Email</Label>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Email"
                        {...field}
                        disabled
                      />
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
                    <Label>Phone</Label>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Phone"
                        {...field}
                        disabled
                      />
                    </FormControl>
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
                    <Label>Wallet Address</Label>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Wallet Address"
                        {...field}
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => {
                return (
                  <FormItem>
                    <Label>Gender</Label>
                    <Select
                      onValueChange={(value) => field.onChange(value as Gender)}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger defaultValue={field.value}>
                          <SelectValue
                            placeholder={field.value || 'Select Gender'}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={Gender.MALE}>Male</SelectItem>
                        <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                        <SelectItem value={Gender.OTHER}>Other</SelectItem>
                        <SelectItem value={Gender.UKNOWN}>Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <div className="flex justify-end mt-3">
            <Button type="submit">Update Profile</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

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
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type Iprops = {
  userDetail: User | undefined;
};
export default function EditProfile({ userDetail }: Iprops) {
  //   const updateUser = useCommunityUserUpdate();
  const updateUser = useUpdateMe();
  const router = useRouter();
  const FormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 4 character' }),
    email: z.string(),
    phone: z.string(),
    walletAddress: z.string(),
    gender: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: userDetail?.name || '',
      email: userDetail?.email || '',
      phone: userDetail?.phone || '',
      walletAddress: userDetail?.wallet || '',
      gender: userDetail?.gender || '',
    },
  });

  useEffect(() => {
    form.reset({
      name: userDetail?.name || '',
      email: userDetail?.email || '',
      phone: userDetail?.phone || '',
      walletAddress: userDetail?.wallet || '',
      gender: userDetail?.gender || '',
    });
  }, [form, userDetail]);
  const handleEditUser = async (data: any) => {
    console.log('formDA', data);
    await updateUser.mutateAsync({
      payload: {
        ...data,
        wallet: data?.walletAddress,
        phone: data?.phone,
      },
    });
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleEditUser)}>
        <div className="grid grid-cols-1 gap-4">
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
                  <Label>Phone</Label>
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
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Gender" />
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
          <Button>Update Profile</Button>
        </div>
      </form>
    </Form>
  );
}

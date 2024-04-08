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
import { User } from '@rumsan/sdk/types';
import { useEffect } from 'react';
import { useCommunityUserUpdate } from '@rahat-ui/community-query';
import { UUID } from 'crypto';
import { useSecondPanel } from '../../providers/second-panel-provider';

type Iprops = {
  userDetail: User;
};
export default function EditUser({ userDetail }: Iprops) {
  const updateUser = useCommunityUserUpdate();
  const { closeSecondPanel } = useSecondPanel();

  const FormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 4 character' }),
    email: z.string(),
    phone: z.string(),
    walletAddress: z
      .string()
      .min(42, { message: 'The Ethereum address must be 42 characters long' }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: userDetail?.name || '',
      email: userDetail?.email || '',
      phone: userDetail?.phone || '',
      walletAddress: userDetail?.wallet || '',
    },
  });

  useEffect(() => {
    form.reset({
      name: userDetail?.name || '',
      email: userDetail?.email || '',
      phone: userDetail?.phone || '',
      walletAddress: userDetail?.wallet || '',
    });
  }, [form, userDetail]);
  const handleEditUser = async (data: any) => {
    await updateUser.mutateAsync({
      uuid: userDetail.uuid as UUID,
      payload: data,
    });
  };

  useEffect(() => {
    updateUser.data?.response.success && closeSecondPanel();
  }, [closeSecondPanel, updateUser.data?.response.success]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleEditUser)}>
        <div className="p-4">
          <h1 className="text-md font-semibold mb-6">Edit User</h1>
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
            {/* <FormField
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
                          <SelectItem value="user">USER</SelectItem>
                          <SelectItem value="admin">ADMIN</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            /> */}
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

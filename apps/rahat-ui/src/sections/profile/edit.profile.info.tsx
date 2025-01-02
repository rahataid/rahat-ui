import React from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserEdit, useUserStore } from '@rumsan/react-query';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { PhoneInput } from '@rahat-ui/shadcn/src/components/ui/phone-input';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { Loader2, Wallet } from 'lucide-react';
import { toast } from 'react-toastify';
import Back from '../projects/components/back';
import HeaderWithBack from '../projects/components/header.with.back';

export default function EditUserProfile() {
  const { user, setUser } = useUserStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));
  const userInfo = React.useMemo(() => user.data, [user]);

  const router = useRouter();

  const FormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    wallet: z.string().optional(),
    phone: z
      .string()
      .optional()
      .refine((val) => !val || isValidPhoneNumber(val), {
        message: 'Invalid phone number',
      }),
    email: z.string(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: userInfo?.name || '',
      wallet: userInfo?.wallet || '',
      email: userInfo?.email,
      phone: userInfo?.phone || '',
    },
  });

  const editUser = useUserEdit();

  const handleEditUserProfile = async (data: z.infer<typeof FormSchema>) => {
    const payload = { uuid: userInfo?.uuid, data: data };
    try {
      const response = await editUser.mutateAsync(payload);
      setUser(response);
    } catch (e) {
      console.error('Error updating user profile:', e);
      toast.error('Error updating user profile');
    }
  };

  React.useEffect(() => {
    if (editUser.isSuccess) {
      toast.success('User updated successfully');
      setTimeout(() => {
        router.push('/profile');
      }, 1000);
    }
  }, [editUser.isSuccess]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleEditUserProfile)}>
        <div className="p-4">
          <HeaderWithBack
            title="Edit User Profile"
            subtitle="Edit user details"
            path="/profile"
          />
          <div className="border shadow-md p-6 rounded-sm bg-card">
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
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
                name="phone"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input disabled placeholder="Email" {...field} />
                      </FormControl>
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
                    <FormItem className="col-span-3">
                      <FormLabel>Wallet Address</FormLabel>
                      <FormControl>
                        <div className="relative w-full">
                          <Wallet className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            disabled={userInfo?.wallet ? true : false}
                            type="text"
                            placeholder="Wallet Address"
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
          </div>
        </div>
        <div className="flex justify-end space-x-2 py-2 px-4 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/users')}
          >
            Cancel
          </Button>
          {editUser.isPending ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button className="px-10">Save Changes</Button>
          )}
        </div>
      </form>
    </Form>
  );
}

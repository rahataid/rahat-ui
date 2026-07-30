import { useTranslations } from 'next-intl';
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
import { Loader2, WALLET } from 'lucide-react';
import { toast } from 'react-toastify';
import Back from '../projects/components/back';
import HeaderWithBack from '../projects/components/header.with.back';

export default function EditUserPROFILE() {
  const { user, setUser } = useUserStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));
  const userInfo = React.useMemo(() => user.data, [user]);

  const router = useRouter();

  const t = useTranslations('PROFILE_EDIT');
  const g = useTranslations('GLOBAL');
  const FormSchema = z.object({
    name: z.string().min(2, { message: t('NAME_MUST_BE_AT_LEAST2') }),
    wallet: z.string().optional(),
    phone: z
      .string()
      .optional()
      .refine((val) => !val || isValidPhoneNumber(val), {
        message: t('INVALID_PHONE_NUMBER'),
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

  const handleEditUserPROFILE = async (data: z.infer<typeof FormSchema>) => {
    const payload = { uuid: userInfo?.uuid, data: data };
    try {
      const response = await editUser.mutateAsync(payload);
      setUser(response);
    } catch (e) {
      console.error('Error updating user profile:', e);
      toast.error(t('ERROR_UPDATING_USER_PROFILE'));
    }
  };

  React.useEffect(() => {
    if (editUser.isSuccess) {
      toast.success(t('USER_UPDATED_SUCCESSFULLY'));
      setTimeout(() => {
        router.push('/profile');
      }, 1000);
    }
  }, [editUser.isSuccess]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleEditUserPROFILE)}>
        <div className="p-4">
          <HeaderWithBack
            title={t('EDIT_USER_PROFILE')}
            subtitle={t('EDIT_USER_DETAILS')}
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
                      <FormLabel>{g('NAME')}</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder={g('NAME')} {...field} />
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
                      <FormLabel>{g('PHONE')}</FormLabel>
                      <FormControl>
                        <PhoneInput placeholder={g('PHONE')} {...field} />
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
                      <FormLabel>{g('EMAIL')}</FormLabel>
                      <FormControl>
                        <Input disabled placeholder={g('EMAIL')} {...field} />
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
                      <FormLabel>{g('WALLET_ADDRESS')}</FormLabel>
                      <FormControl>
                        <div className="relative w-full">
                          <WALLET className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            disabled={userInfo?.wallet ? true : false}
                            type="text"
                            placeholder={g('WALLET_ADDRESS')}
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
            {g('CANCEL')}
          </Button>
          {editUser.isPending ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {g('PLEASE_WAIT')}
            </Button>
          ) : (
            <Button className="px-10">{g('SAVE_CHANGES')}</Button>
          )}
        </div>
      </form>
    </Form>
  );
}

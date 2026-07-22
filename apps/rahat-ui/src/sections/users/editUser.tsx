import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTranslations } from 'next-intl';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { User } from '@rumsan/sdk/types';
import { useEffect } from 'react';
import { UUID } from 'crypto';
import { useUserUpdate } from '@rahat-ui/query';
import { useSecondPanel } from '../../providers/second-panel-provider';
import { PhoneInput } from '@rahat-ui/shadcn/src/components/ui/phone-input';

type Iprops = {
  userDetail: User;
};
export default function EditUser({ userDetail }: Iprops) {
  const t = useTranslations('Users – Edit');
  const tg = useTranslations('GLOBAL');
  const { closeSecondPanel } = useSecondPanel();
  const updateUser = useUserUpdate();
  const FormSchema = z.object({
    name: z.string().min(2, { message: t('NAME_MUST_BE_AT_LEAST4') }),
    email: z.string(),
    phone: z.string(),
    walletAddress: z
      .string()
      .min(42, { message: t('ETH_ADDRESS_MUST_BE42') }),
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
    const result = await updateUser.mutateAsync({
      uuid: userDetail.uuid as UUID,
      payload: data,
    });
    if (result?.response?.success) {
      closeSecondPanel();
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleEditUser)}>
        <div className="p-4">
          <h1 className="text-md font-semibold mb-6">{t('EDIT_USER')}</h1>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Input type="text" placeholder={tg('NAME')} {...field} />
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
                      <Input type="text" placeholder={tg('EMAIL')} {...field} />
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
                      <PhoneInput placeholder={tg('PHONE')} {...field} />
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
                        placeholder={tg('WALLET_ADDRESS')}
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
            <Button>{t('UPDATE_USER')}</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

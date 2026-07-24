import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function DHMBulletinDialog() {
  const t = useTranslations('AA Project');
  const FormSchema = z.object({
    waterWay: z.string().min(5, { message: t('MUST_BE_AT_LEAST_5_CHARACTERS') }),
    river: z.string().min(5, { message: t('MUST_BE_AT_LEAST_5_CHARACTERS') }),
    todayStatus: z
      .string()
      .min(5, { message: t('MUST_BE_AT_LEAST_5_CHARACTERS') }),
    tomorrowStatus: z
      .string()
      .min(5, { message: t('MUST_BE_AT_LEAST_5_CHARACTERS') }),
    dayAfterTomorrowStatus: z
      .string()
      .min(5, { message: t('MUST_BE_AT_LEAST_5_CHARACTERS') }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      waterWay: '',
      river: '',
      todayStatus: '',
      tomorrowStatus: '',
      dayAfterTomorrowStatus: '',
    },
  });

  const handleUpdateBulletin = async (data: z.infer<typeof FormSchema>) => {
    alert('done');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="rounded-full border border-primary text-primary bg-card p-2 cursor-pointer">
          <Pencil size={20} strokeWidth={1.5} />
        </div>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdateBulletin)}>
            <DialogHeader>
              <DialogTitle>{t('UPDATE_BULLETIN')}</DialogTitle>
            </DialogHeader>
            <div className="mt-4 grid gap-4">
              <FormField
                control={form.control}
                name="waterWay"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{t('WATERWAY')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('ENTER_WATERWAY')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="river"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{t('RIVER')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('ENTER_RIVER')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="todayStatus"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{t('TODAYS_STATUS')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('ENTER_STATUS')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="tomorrowStatus"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{t('TOMORROWS_STATUS')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('ENTER_STATUS')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="dayAfterTomorrowStatus"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{t('DAY_AFTER_TOMORROW_STATUS')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('ENTER_STATUS')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <div className="flex justify-between gap-2 mt-4">
                <Button
                  type="button"
                  variant="secondary"
                  className="bg-red-100 text-red-600 w-full"
                >
                  {t('CANCEL')}
                </Button>
                <Button type="submit" className="w-full">
                  {t('UPDATE')}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

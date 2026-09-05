'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateAuthApp } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { FormField } from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { useForm } from 'react-hook-form';
import { isAddress } from 'viem';
import { z } from 'zod';
import { useTranslations } from 'next-intl';

export default function AddAppAuthentication() {
  const t = useTranslations('AUTH_APPS_ADD');
  const tg = useTranslations('GLOBAL');
  const createAuthApp = useCreateAuthApp();

  const FormSchema = z.object({
    name: z.string().min(2, { message: t('NAME_MUST_BE_AT_LEAST2') }),
    address: z.string().refine(
      (value) => {
        if (isAddress(value)) return true;
      },
      {
        message: t('INVALID_APP_ADDRESS'),
      },
    ),
    description: z.string().optional(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      address: '',
      description: '',
    },
  });

  const handleAddAppAuthentication = async (
    data: z.infer<typeof FormSchema>,
  ) => {
    await createAuthApp.mutateAsync(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleAddAppAuthentication)}>
      <div className="p-4 h-add rounded border bg-white">
        <h1 className="text-lg font-semibold mb-6">{t('ADD_NEW')}</h1>
        <div className="shadow-md p-4 rounded-sm">
          <div className="grid grid-cols-2 gap-5 mb-4">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <div className="col-span-1">
                  <Label>{tg('NAME')}</Label>
                  <Input
                    type="text"
                    placeholder={t('ENTER_APP_NAME')}
                    className=" mt-4 "
                    {...field}
                  />

                  {errors.name && (
                    <Label className="text-red-500">
                      {errors.name.message}
                    </Label>
                  )}
                </div>
              )}
            />

            <FormField
              control={control}
              name="address"
              render={({ field }) => (
                <div className="col-span-1">
                  <Label>{tg('ADDRESS')}</Label>
                  <Input
                    type="text"
                    placeholder={t('ENTER_APP_ADDRESS')}
                    className=" mt-4 "
                    {...field}
                  />

                  {errors.address && (
                    <Label className="text-red-500">
                      {errors.address.message}
                    </Label>
                  )}
                </div>
              )}
            />

            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <div className="col-span-1">
                  <Label>{tg('DESCRIPTION')}</Label>
                  <Input
                    type="text"
                    placeholder={t('SHORT_DESCRIPTION_ABOUT_APP')}
                    className=" mt-4 "
                    {...field}
                  />

                  {errors.description && (
                    <Label className="text-red-500">
                      {errors.description.message}
                    </Label>
                  )}
                </div>
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">{tg('SAVE')}</Button>
          </div>
        </div>
      </div>
    </form>
  );
}

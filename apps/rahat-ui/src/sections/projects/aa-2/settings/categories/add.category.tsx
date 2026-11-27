'use client';

import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { useAddActivityCategory } from '@rahat-ui/query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { FormInput } from 'apps/rahat-ui/src/common';

type IProps = {
  open: boolean;
  onClose: () => void;
};

export default function AddCategoryDialog({ open, onClose }: IProps) {
  const t = useTranslations('AA_PROJECT');
  const { id } = useParams();
  const projectUUID = id as UUID;
  const { mutateAsync: addCategory, isPending } = useAddActivityCategory();

  const FormSchema = z.object({
    name: z.string().min(1, { message: t('NAME_IS_REQUIRED') }),
  });

  type FormValues = z.infer<typeof FormSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { name: '' },
  });
  const { handleSubmit, reset } = form;

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (values: FormValues) => {
    await addCategory({ uuid: projectUUID, name: values.name });
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('ADD_CATEGORY')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>{t('NAME')}</FormLabel>
                  <FormControl>
                    <FormInput placeholder={t('CATEGORY_NAME')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                {t('CANCEL')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? t('ADDING') : t('SUBMIT')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

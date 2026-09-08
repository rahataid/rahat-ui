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
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });

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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="name">{t('NAME')}</Label>
            <Input
              id="name"
              placeholder={t('CATEGORY_NAME')}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              {t('CANCEL')}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t('ADDING') : t('SUBMIT')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

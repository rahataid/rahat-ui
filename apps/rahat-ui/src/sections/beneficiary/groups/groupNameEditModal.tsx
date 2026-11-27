'use client';

import { useUpdateBeneficiaryGroup } from '@rahat-ui/query';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
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
import { ListBeneficiaryGroup } from '@rahat-ui/types';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations } from 'next-intl';
import ConfirmationDialog from 'apps/rahat-ui/src/common/confirmationDialog';

type EditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  beneficiaryGroupDetail: ListBeneficiaryGroup;
};

export default function GroupNameEditModal({
  open,
  onOpenChange,
  beneficiaryGroupDetail,
}: EditDialogProps) {
  const updateBeneficiaryGroup = useUpdateBeneficiaryGroup();
  const t = useTranslations('GLOBAL');
  const [showResetDialog, setShowResetDialog] = React.useState(false);

  const FormSchema = z.object({
    name: z
      .string()
      .min(1, t('GROUP_NAME_REQUIRED'))
      .max(50, t('GROUP_NAME_MAX_LENGTH'))
      .trim(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
    defaultValues: {
      name: beneficiaryGroupDetail?.name ?? '',
    },
  });

  const { reset, handleSubmit, control } = form;

  useEffect(() => {
    if (open) {
      reset({ name: beneficiaryGroupDetail?.name ?? '' });
    }
  }, [open, beneficiaryGroupDetail?.name]);

  const handleUpdateBeneficiaryGroup = async (
    data: z.infer<typeof FormSchema>,
  ) => {
    const payload = {
      uuid: beneficiaryGroupDetail.uuid,
      ...data,
      successMessage: t('BENEFICIARY_GROUP_UPDATED_SUCCESSFULLY'),
      errorMessage: t('ERROR_WHILE_UPDATING_BENEFICIARY_GROUP'),
    };
    await updateBeneficiaryGroup.mutateAsync(payload, {
      onSuccess: () => {
        // window.location.reload();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{t('EDIT_BENEFICIARY_GROUP_NAME')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(handleUpdateBeneficiaryGroup)}
            className="space-y-4"
          >
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="group-name">{t('BENEFICIARY_GROUP_NAME')}</Label>
                  <FormControl>
                    <Input
                      id="group-name"
                      placeholder={t('ENTER_BENEFICIARY_GROUP_NAME')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setShowResetDialog(true)}>
                {t('RESET')}
              </Button>
              <Button type="submit" disabled={updateBeneficiaryGroup.isPending}>
                {updateBeneficiaryGroup.isPending ? t('SAVING') : t('CONFIRM')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
        <ConfirmationDialog
          isConfirmationDialogOpen={showResetDialog}
          onCancel={() => setShowResetDialog(false)}
          onConfirm={() => {
            reset();
            setShowResetDialog(false);
          }}
          dialogTitle={t('RESET_FORM')}
          dialogMessage={t('RESET_FORM_ALERT')}
          confirmLabel={t('RESET')}
        />
      </DialogContent>
    </Dialog>
  );
}

'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAddProjectFund } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { UUID } from 'crypto';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTranslations } from 'next-intl';

const makeAddFundSchema = (t: (key: string) => string) =>
  z.object({
    amount: z
      .string()
      .min(1, t('AMOUNT_IS_REQUIRED'))
      .refine((val) => !isNaN(Number(val)), {
        message: t('AMOUNT_MUST_BE_NUMBER'),
      })
      .refine((val) => Number(val) > 0, {
        message: t('AMOUNT_MUST_BE_GREATER_THAN_0'),
      })
      .refine((val) => Number.isFinite(Number(val)), {
        message: t('AMOUNT_MUST_BE_FINITE_NUMBER'),
      }),
  });

type AddFundFormValues = z.infer<ReturnType<typeof makeAddFundSchema>>;

type IProps = {
  open: boolean;
  onClose: () => void;
  projectUUID: UUID;
};

export default function AddFundDialog({ open, onClose, projectUUID }: IProps) {
  const t = useTranslations('AA_PROJECT');
  const addProjectFund = useAddProjectFund(projectUUID);

  const form = useForm<AddFundFormValues>({
    resolver: zodResolver(makeAddFundSchema(t)),
    defaultValues: { amount: '' },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = async (values: AddFundFormValues) => {
    await addProjectFund.mutateAsync({ amount: values.amount });
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent
        className="!rounded-sm max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t('ADD_FUND')}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('AMOUNT')}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="decimal"
                      min="0"
                      placeholder={t('ENTER_FUND_AMOUNT_PLACEHOLDER')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={addProjectFund.isPending}
                className="w-full rounded-sm"
              >
                {t('CANCEL')}
              </Button>
              <Button
                type="submit"
                disabled={addProjectFund.isPending}
                className="w-full rounded-sm"
              >
                {addProjectFund.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('ADDING')}
                  </>
                ) : (
                  t('ADD_FUND')
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

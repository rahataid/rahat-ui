'use client';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { HeaderWithBack } from 'apps/rahat-ui/src/common';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { DialogComponent } from '../activities/details/dialog.reuse';
import { Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { cn } from '@rahat-ui/shadcn/src';
import { useEffect, useState } from 'react';
import { useConfigureThreshold, usePhasesStore } from '@rahat-ui/query';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';

export default function ManageThreshold() {
  const t = useTranslations('AA Project');
  const tGlobal = useTranslations('GLOBAL');
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { id, phaseId } = useParams();
  const { threshold } = usePhasesStore((state) => ({
    threshold: state.threshold,
  }));
  const { mutateAsync, isSuccess } = useConfigureThreshold();

  const FormSchema = z.object({
    requiredMandatoryTriggers: z.preprocess(
      (val) => Number(val),
      z
        .number({ invalid_type_error: t('PLEASE_ENTER_VALID_NUMBER') })
        .int(t('PLEASE_ENTER_INTEGER'))
        .nonnegative(t('VALUE_CANNOT_BE_NEGATIVE')),
    ),
    requiredOptionalTriggers: z.preprocess(
      (val) => Number(val),
      z
        .number({ invalid_type_error: t('PLEASE_ENTER_VALID_NUMBER') })
        .int(t('PLEASE_ENTER_INTEGER'))
        .nonnegative(t('VALUE_CANNOT_BE_NEGATIVE')),
    ),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      requiredMandatoryTriggers: threshold?.mandatory,
      requiredOptionalTriggers: threshold?.optional,
    },
    mode: 'onChange',
  });

  const handleConfigureThreshhold = async (
    data: z.infer<typeof FormSchema>,
  ) => {
    const payload = {
      uuid: phaseId as string,
      requiredMandatoryTriggers: data?.requiredMandatoryTriggers,
      requiredOptionalTriggers: data?.requiredOptionalTriggers,
    };

    await mutateAsync({ projectUUID: id as UUID, payload });
  };

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      router.push(
        `/projects/aa/${id}/trigger-statements/phase/${phaseId as string}`,
      );
    }
  }, [isSuccess]);

  console.log(form.formState.isValid);
  return (
    <div className="p-4">
      <HeaderWithBack
        path=""
        subtitle={t('SET_UP_YOUR_TRIGGER_STATEMENT')}
        title={t('CONFIGURE_PHASE', { phase: threshold.name.charAt(0).toUpperCase() + threshold.name.slice(1).toLowerCase() })}
      />

      <Form {...form}>
        <form>
          <div className=" p-4 rounded-lg border bg-card gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
              <FormField
                control={form.control}
                name="requiredMandatoryTriggers"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Label>{t('MANDATORY')}</Label>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={t('ENTER_MANDATORY_VALUE')}
                          className="[&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-outer-spin-button]:opacity-100"
                          onKeyDown={(e) => {
                            const invalidKeys = [
                              'e',
                              'E',
                              '+',
                              '-',
                              '.',
                              ',',
                              '*',
                              '/',
                              '@',
                              '#',
                              '$',
                              '%',
                              '^',
                              '&',
                              '(',
                              ')',
                            ];
                            if (invalidKeys.includes(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="requiredOptionalTriggers"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Label>{t('OPTIONAL')}</Label>
                      <FormControl>
                        <Input
                          type="number"
                          className="[&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-outer-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:bg-slate-400"
                          placeholder={t('ENTER_OPTIONAL_VALUE')}
                          onKeyDown={(e) => {
                            const invalidKeys = [
                              'e',
                              'E',
                              '+',
                              '-',
                              '.',
                              ',',
                              '*',
                              '/',
                              '@',
                              '#',
                              '$',
                              '%',
                              '^',
                              '&',
                              '(',
                              ')',
                            ];
                            if (invalidKeys.includes(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="secondary"
                className=" px-8 "
                onClick={() => {
                  form.reset();
                  // router.back()
                }}
              >
                {t('RESET')}
              </Button>

              <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
                <Button
                  className="rounded-sm"
                  onClick={() => setOpen(true)}
                  type="button"
                  disabled={!form.formState.isValid}
                >
                  {t('CONFIGURE')}
                </Button>
                <DialogContent
                  className="!rounded-sm"
                  onInteractOutside={(e) => {
                    e.preventDefault();
                  }}
                >
                  <DialogHeader className="!text-center">
                    <DialogTitle>{t('CONFIRM_CONFIGURATION')}</DialogTitle>
                    <DialogDescription>
                      {t('CONFIRM_TRIGGER_THRESHOLD')}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="border rounded-sm h-24 bg-slate-100 flex flex-col p-5 gap-4">
                    <Label>
                      {t('MANDATORY')} : {form.watch('requiredMandatoryTriggers')}
                    </Label>

                    <Label>
                      {t('OPTIONAL')} : {form.watch('requiredOptionalTriggers')}
                    </Label>
                  </div>
                  <DialogFooter className="flex justify-between">
                    <Button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="w-full rounded-sm"
                      variant="outline"
                    >
                      {tGlobal('CANCEL')}
                    </Button>
                    <Button
                      type="submit"
                      className={cn('w-full rounded-sm')}
                      onClick={form.handleSubmit(handleConfigureThreshhold)}
                    >
                      {t('CONFIRM')}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

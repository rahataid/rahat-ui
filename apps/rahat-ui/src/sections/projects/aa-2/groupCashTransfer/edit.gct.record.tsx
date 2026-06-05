'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import { Loader2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import { HeaderWithBack } from 'apps/rahat-ui/src/common';
import { useGetOneGctRecord, useUpdateGctRecord } from '@rahat-ui/query';
import SpinnerLoader from 'apps/rahat-ui/src/sections/projects/components/spinner.loader';
import { SectionCard } from './components/gct.form-sections';

const EditGctRecordSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, {
      message: 'Amount must be a positive number',
    }),
});

type EditGctRecordValues = z.infer<typeof EditGctRecordSchema>;

export default function EditGctRecord() {
  const { id, recordUuid } = useParams();
  const router = useRouter();
  const projectUUID = id as UUID;
  const backPath = `/projects/aa/${id}/group-cash-transfer/records/${recordUuid}`;

  const [pendingValues, setPendingValues] = useState<EditGctRecordValues | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data, isLoading } = useGetOneGctRecord(projectUUID, recordUuid as string);
  const updateRecord = useUpdateGctRecord(projectUUID);
  const record = data?.data ?? data ?? null;

  const form = useForm<EditGctRecordValues>({
    resolver: zodResolver(EditGctRecordSchema),
    defaultValues: { title: '', amount: '' },
  });

  useEffect(() => {
    if (!record) return;
    form.reset({
      title: record.title ?? '',
      amount: String(record.amount ?? ''),
    });
  }, [record]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (values: EditGctRecordValues) => {
    setPendingValues(values);
    setConfirmOpen(true);
  };

  const handleConfirmedUpdate = async () => {
    if (!pendingValues) return;
    setConfirmOpen(false);
    await updateRecord.mutateAsync({
      uuid: recordUuid as string,
      title: pendingValues.title,
      amount: Number(pendingValues.amount),
    });
    router.push(backPath);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <SpinnerLoader />
      </div>
    );
  }

  return (
    <div className="p-4">
      <HeaderWithBack
        title="Edit Fund Record"
        subtitle="Update the details for this fund record"
        path={backPath}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <SectionCard title="Record Details">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <Label>
                      Fund Title <span className="text-destructive">*</span>
                    </Label>
                    <FormControl>
                      <Input placeholder="Enter fund title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <Label>
                      Amount <span className="text-destructive">*</span>
                    </Label>
                    <FormControl>
                      <Input type="number" min={1} placeholder="Enter amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                className="px-8"
                onClick={() => form.reset({ title: record?.title ?? '', amount: String(record?.amount ?? '') })}
                disabled={updateRecord.isPending}
              >
                Clear
              </Button>
              <Button
                type="submit"
                className="px-8"
                disabled={updateRecord.isPending || !form.formState.isDirty}
              >
                {updateRecord.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Confirm'
                )}
              </Button>
            </div>
          </SectionCard>
        </form>
      </Form>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update{' '}
              <span className="font-semibold text-foreground">
                "{record?.title}"
              </span>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updateRecord.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmedUpdate}
              disabled={updateRecord.isPending}
            >
              {updateRecord.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Confirm'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

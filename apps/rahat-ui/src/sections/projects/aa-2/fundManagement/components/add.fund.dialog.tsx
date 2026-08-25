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

const AddFundSchema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(Number(val)), {
      message: 'Amount must be a number',
    })
    .refine((val) => Number(val) > 0, {
      message: 'Amount must be greater than 0',
    })
    .refine((val) => Number.isFinite(Number(val)), {
      message: 'Amount must be a finite number',
    }),
});

type AddFundFormValues = z.infer<typeof AddFundSchema>;

type IProps = {
  open: boolean;
  onClose: () => void;
  projectUUID: UUID;
};

export default function AddFundDialog({ open, onClose, projectUUID }: IProps) {
  const addProjectFund = useAddProjectFund(projectUUID);

  const form = useForm<AddFundFormValues>({
    resolver: zodResolver(AddFundSchema),
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
          <DialogTitle>Add Fund</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="decimal"
                      min="0"
                      placeholder="Enter fund amount"
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
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addProjectFund.isPending}
                className="w-full rounded-sm"
              >
                {addProjectFund.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Fund'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

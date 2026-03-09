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
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const FormSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(100),
});

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
  const updateBeneficiaryGroup = useUpdateBeneficiaryGroup({
    onSuccess: () => onOpenChange(false),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: beneficiaryGroupDetail?.name ?? '',
    },
  });

  const handleUpdateBeneficiaryGroup = async (
    data: z.infer<typeof FormSchema>,
  ) => {
    const payload = {
      uuid: beneficiaryGroupDetail.uuid,
      ...data,
    };
    await updateBeneficiaryGroup.mutateAsync(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit Beneficiary Group Name</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdateBeneficiaryGroup)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="group-name">Beneficiary Group Name</Label>
                  <FormControl>
                    <Input
                      id="group-name"
                      placeholder="Enter beneficiary group name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button type="submit" disabled={updateBeneficiaryGroup.isPending}>
                {updateBeneficiaryGroup.isPending ? 'Saving...' : 'Confirm'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

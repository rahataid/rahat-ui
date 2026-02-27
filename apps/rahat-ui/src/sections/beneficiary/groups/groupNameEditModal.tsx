'use client';

import { useUpdateBeneficiaryGroup } from '@rahat-ui/query';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/components/dialog';
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

type EditModalType = {
  value: boolean;
  onToggle: () => void;
  onFalse: () => void;
};

type IProps = {
  beneficiaryGroupDetail: ListBeneficiaryGroup & {
    groupedBeneficiaries?: { Beneficiary: { uuid: string } }[];
  };
  editModal: EditModalType;
};

export default function GroupNameEditModal({
  editModal,
  beneficiaryGroupDetail,
}: IProps) {
  const updateBeneficiaryGroup = useUpdateBeneficiaryGroup();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: beneficiaryGroupDetail?.name ?? '',
    },
  });

  // React.useEffect(() => {
  //   if (beneficiaryGroupDetail?.name) {
  //     form.reset({ name: beneficiaryGroupDetail.name });
  //   }
  // }, [beneficiaryGroupDetail?.name]);

  const handleUpdateBeneficiaryGroup = async (
    data: z.infer<typeof FormSchema>,
  ) => {
    // const members =
    //   beneficiaryGroupDetail?.groupedBeneficiaries?.map((item) => ({
    //     uuid: item?.Beneficiary?.uuid,
    //   })) ?? [];
    const payload = {
      uuid: beneficiaryGroupDetail.uuid,
      ...data,
      // beneficiaries: members,
    };
    await updateBeneficiaryGroup.mutateAsync(payload, {
      onSuccess: () => {
        editModal.onFalse();
      },
      onError: (e) => {
        console.error('Error while updating beneficiary group::', e);
      },
    });
  };

  return (
    <Dialog open={editModal.value} onOpenChange={editModal.onToggle}>
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
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={updateBeneficiaryGroup.isPending}>
                {updateBeneficiaryGroup.isPending ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

'use client';

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { HeaderWithBack } from 'apps/rahat-ui/src/common';
import {
  useAssignGroupCashTransferFund,
  useGroupCashTransfers,
} from '@rahat-ui/query';

// ─── Schema ───────────────────────────────────────────────────────────────────

const AssignCashSchema = z.object({
  title: z.string().min(1, 'Fund title is required'),
  groupCashTransferId: z.string().min(1, 'Please select a GCT group'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, {
      message: 'Amount must be a positive number',
    }),
});

type AssignCashValues = z.infer<typeof AssignCashSchema>;

// ─── Component ────────────────────────────────────────────────────────────────

export default function AssignCashGct() {
  const { id } = useParams();
  const router = useRouter();
  const projectUUID = id as UUID;

  const assignFund = useAssignGroupCashTransferFund(projectUUID);

  // Fetch all groups for the dropdown (high perPage, no pagination needed here)
  const { data: groupsData, isLoading: groupsLoading } = useGroupCashTransfers(
    projectUUID,
    { page: 1, perPage: 100, order: 'asc', sort: 'name' },
  );
  const groups: { uuid: string; name: string }[] = groupsData?.data ?? [];

  const form = useForm<AssignCashValues>({
    resolver: zodResolver(AssignCashSchema),
    defaultValues: {
      title: '',
      groupCashTransferId: '',
      amount: '',
    },
  });

  const handleSubmit = async (values: AssignCashValues) => {
    await assignFund.mutateAsync({
      title: values.title,
      groupCashTransferId: values.groupCashTransferId,
      amount: Number(values.amount),
    });
    router.push(`/projects/aa/${id}/group-cash-transfer?tab=gctManagementList`);
  };

  const handleClear = () => form.reset();

  return (
    <div className="p-4">
      <HeaderWithBack
        title="Assign Cash"
        subtitle="Fill the form below to assign cash to a GCT Group"
        path={`/projects/aa/${id}/group-cash-transfer`}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="p-4 rounded-sm border bg-card space-y-4">

            {/* Row 1: Fund Title + GCT Group */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <Label>
                      GCT Fund Title <span className="text-destructive">*</span>
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
                name="groupCashTransferId"
                render={({ field }) => (
                  <FormItem>
                    <Label>
                      GCT Group <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={groupsLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              groupsLoading ? 'Loading groups…' : 'Select a GCT Group'
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {groups.map((g) => (
                          <SelectItem key={g.uuid} value={g.uuid}>
                            {g.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 2: Amount */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <Label>
                      Amount <span className="text-destructive">*</span>
                    </Label>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="Enter amount"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                className="px-8"
                onClick={handleClear}
                disabled={assignFund.isPending}
              >
                Clear
              </Button>
              <Button
                type="submit"
                className="px-8"
                disabled={assignFund.isPending}
              >
                {assignFund.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Assigning…
                  </>
                ) : (
                  'Assign Cash'
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

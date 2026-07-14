'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import { Loader2, Search } from 'lucide-react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/src/components/ui/popover';
import { HeaderWithBack } from 'apps/rahat-ui/src/common';
import {
  useAssignGroupCashTransferFund,
  useGetAllValidGroupCashTransfers,
} from '@rahat-ui/query';
import { AssignCashSchema, AssignCashValues } from './types/gct.schemas';
import { SectionCard } from './components/gct.form-sections';

export default function AssignCashGct() {
  const { id } = useParams();
  const router = useRouter();
  const projectUUID = id as UUID;

  const assignFund = useAssignGroupCashTransferFund(projectUUID);
  const { data: groupsData, isLoading: groupsLoading } =
    useGetAllValidGroupCashTransfers(projectUUID);
  const groups: { uuid: string; name: string }[] =
    groupsData?.data ?? groupsData ?? [];

  const [groupSearch, setGroupSearch] = useState('');
  const [groupPopoverOpen, setGroupPopoverOpen] = useState(false);
  const [selectedGroupName, setSelectedGroupName] = useState('');
  const [pendingValues, setPendingValues] = useState<AssignCashValues | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const filteredGroups = useMemo(() => {
    if (!groupSearch.trim()) return groups;
    const lower = groupSearch.toLowerCase();
    return groups.filter((g) => g.name.toLowerCase().includes(lower));
  }, [groups, groupSearch]);

  const form = useForm<AssignCashValues>({
    resolver: zodResolver(AssignCashSchema),
    defaultValues: { title: '', groupCashTransferId: '', amount: '' },
  });

  const handleSubmit = (values: AssignCashValues) => {
    setPendingValues(values);
    setConfirmOpen(true);
  };

  const handleConfirmedAssign = async () => {
    if (!pendingValues) return;
    setConfirmOpen(false);
    try {
      await assignFund.mutateAsync({
        title: pendingValues.title,
        groupCashTransferId: pendingValues.groupCashTransferId,
        amount: Number(pendingValues.amount),
      });
      router.push(`/projects/aa/${id}/group-cash-transfer?tab=gctManagementList`);
    } catch (error: any) {
      const msg: string = error?.response?.data?.message || error?.message || '';
      if (/already|duplicate|reserved/i.test(msg)) {
        form.setError('groupCashTransferId', {
          message: 'This group already has funds reserved.',
        });
      }
    }
  };

  return (
    <div className="p-4">
      <HeaderWithBack
        title="Assign Cash"
        subtitle="Fill the form below to assign cash to a GCT Group"
        path={`/projects/aa/${id}/group-cash-transfer?tab=gctManagementList`}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <SectionCard title="Fund Details">
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
                    <Popover
                      open={groupPopoverOpen}
                      onOpenChange={setGroupPopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            disabled={groupsLoading}
                            className="w-full justify-between font-normal"
                          >
                            {groupsLoading
                              ? 'Loading groups…'
                              : selectedGroupName || 'Select a validated GCT Group'}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[320px] p-0" align="start">
                        <div className="flex items-center border-b px-3 py-2 gap-2">
                          <Search
                            size={14}
                            className="text-muted-foreground shrink-0"
                          />
                          <input
                            className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                            placeholder="Search groups…"
                            value={groupSearch}
                            onChange={(e) => setGroupSearch(e.target.value)}
                          />
                        </div>
                        <div className="max-h-[200px] overflow-y-auto">
                          {filteredGroups.length === 0 ? (
                            <p className="text-sm text-muted-foreground p-3 text-center">
                              No validated groups found.
                            </p>
                          ) : (
                            filteredGroups.map((g) => (
                              <button
                                key={g.uuid}
                                type="button"
                                className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors"
                                onClick={() => {
                                  field.onChange(g.uuid);
                                  setSelectedGroupName(g.name);
                                  setGroupPopoverOpen(false);
                                  setGroupSearch('');
                                }}
                              >
                                {g.name}
                              </button>
                            ))
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                className="px-8"
                onClick={() => {
                  form.reset();
                  setSelectedGroupName('');
                  setGroupSearch('');
                }}
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
          </SectionCard>
        </form>
      </Form>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Assign Cash</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to assign{' '}
              <span className="font-semibold text-foreground">
                NPR {Number(pendingValues?.amount).toLocaleString()}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-foreground">
                "{selectedGroupName}"
              </span>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={assignFund.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmedAssign}
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
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

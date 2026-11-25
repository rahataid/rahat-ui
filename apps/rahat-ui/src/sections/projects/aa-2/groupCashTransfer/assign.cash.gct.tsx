'use client';
import { useTranslations } from 'next-intl';

import { useEffect, useMemo, useRef, useState } from 'react';
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
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
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
import {
  FormComboboxTrigger,
  FormInput,
  HeaderWithBack,
  UnsavedChangesDialog,
} from 'apps/rahat-ui/src/common';
import { useUnsavedChanges } from 'apps/rahat-ui/src/hooks/useUnsavedChanges';
import { useSessionFormStorage } from 'apps/rahat-ui/src/hooks/useSessionFormStorage';
import {
  useAssignGroupCashTransferFund,
  useGetAllValidGroupCashTransfers,
} from '@rahat-ui/query';
import { buildAssignCashSchema, AssignCashValues } from './types/gct.schemas';
import { useNumberFormat } from '../../../../utils/i18n/number';
import { SectionCard } from './components/gct.form-sections';

const DEFAULT_VALUES: AssignCashValues = {
  title: '',
  groupCashTransferId: '',
  amount: '',
};

export default function AssignCashGct() {
  const t = useTranslations('AA_PROJECT_WITH_CASH_TRACKER');
  const tGlobal = useTranslations('GLOBAL');

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
  const formatNum = useNumberFormat();
  const [pendingValues, setPendingValues] = useState<AssignCashValues | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const hasInteracted = useRef(false);
  const isRestored = useRef(false);
  const isSubmittingRef = useRef(false);

  const filteredGroups = useMemo(() => {
    if (!groupSearch.trim()) return groups;
    const lower = groupSearch.toLowerCase();
    return groups.filter((g) => g.name.toLowerCase().includes(lower));
  }, [groups, groupSearch]);

  const AssignCashSchema = buildAssignCashSchema(t);
  const form = useForm<AssignCashValues>({
    resolver: zodResolver(AssignCashSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const { loadSaved, saveData, clearSaved } = useSessionFormStorage<AssignCashValues>({
    key: 'gct_assign_cash_draft',
    projectId: id as string,
    defaultValue: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (isRestored.current || !id || groupsLoading) return;
    const saved = loadSaved();
    if (saved && Object.values(saved).some(Boolean)) {
      const group = groups.find((g) => g.uuid === saved.groupCashTransferId);
      form.reset({ ...saved, groupCashTransferId: group?.uuid ?? '' });
      setSelectedGroupName(group?.name ?? '');
    }
    isRestored.current = true;
  }, [id, groupsLoading]);

  const hasUnsavedChanges =
    !isSubmittingRef.current && hasInteracted.current && form.formState.isDirty;

  const {
    showDialog,
    handleConfirmLeave,
    handleCancelLeave,
    handleDiscardLeave,
  } = useUnsavedChanges({
    hasUnsavedChanges,
    onConfirm: () => {
      saveData(form.getValues());
    },
    onDiscard: () => {
      clearSaved();
    },
  });

  const handleSubmit = (values: AssignCashValues) => {
    setPendingValues(values);
    setConfirmOpen(true);
  };

  const handleConfirmedAssign = async () => {
    if (!pendingValues) return;
    setConfirmOpen(false);
    isSubmittingRef.current = true;
    try {
      await assignFund.mutateAsync({
        title: pendingValues.title,
        groupCashTransferId: pendingValues.groupCashTransferId,
        amount: Number(pendingValues.amount),
      });
      clearSaved();
      router.push(`/projects/aa/${id}/group-cash-transfer?tab=gctManagementList`);
    } catch (error: any) {
      isSubmittingRef.current = false;
      const msg: string = error?.response?.data?.message || error?.message || '';
      if (/already|duplicate|reserved/i.test(msg)) {
        form.setError('groupCashTransferId', {
          message: t('THIS_GROUP_ALREADY_HAS_FUNDS_RESERVED'),
        });
      }
    }
  };

  return (
    <div className="p-4">
      <HeaderWithBack
        title={t('ASSIGN_CASH')}
        subtitle={t('FILL_THE_FORM_BELOW_TO_ASSIGN_CASH')}
        path={`/projects/aa/${id}/group-cash-transfer?tab=gctManagementList`}
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          onFocus={() => {
            hasInteracted.current = true;
          }}
        >
          <SectionCard titleKey="FUND_DETAILS">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>{t('GCT_FUND_TITLE')}</FormLabel>
                    <FormControl>
                      <FormInput placeholder={t('ENTER_FUND_TITLE')} {...field} />
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
                    <FormLabel required>{t('GCT_GROUP')}</FormLabel>
                    <Popover
                      open={groupPopoverOpen}
                      onOpenChange={setGroupPopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <FormComboboxTrigger
                            value={field.value}
                            disabled={groupsLoading}
                            className="w-full justify-between font-normal"
                          >
                            {groupsLoading
                              ? t('LOADING_GROUPS')
                              : selectedGroupName || t('SELECT_A_VALIDATED_GCT_GROUP')}
                          </FormComboboxTrigger>
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
                            placeholder={t('SEARCH_GROUPS')}
                            value={groupSearch}
                            onChange={(e) => setGroupSearch(e.target.value)}
                          />
                        </div>
                        <div className="max-h-[200px] overflow-y-auto">
                          {filteredGroups.length === 0 ? (
                            <p className="text-sm text-muted-foreground p-3 text-center">
                              {t('NO_VALIDATED_GROUPS_FOUND')}
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
                    <FormLabel required>{t('AMOUNT')}</FormLabel>
                    <FormControl>
                      <FormInput
                        type="number"
                        min={1}
                        placeholder={t('ENTER_AMOUNT')}
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
                  clearSaved();
                  form.reset(DEFAULT_VALUES);
                  setSelectedGroupName('');
                  setGroupSearch('');
                }}
                disabled={assignFund.isPending}
              >
                {t('CLEAR')}
              </Button>
              <Button
                type="submit"
                className="px-8"
                disabled={assignFund.isPending}
              >
                {assignFund.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('ASSIGNING')}
                  </>
                ) : (
                  t('ASSIGN_CASH')
                )}
              </Button>
            </div>
          </SectionCard>
        </form>
      </Form>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('CONFIRM_ASSIGN_CASH')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('ARE_YOU_SURE_YOU_WANT_TO_ASSIGN', {
                amount: `NPR ${formatNum(Number(pendingValues?.amount ?? 0))}`,
                groupName: selectedGroupName,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={assignFund.isPending}>{tGlobal('CANCEL')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmedAssign}
              disabled={assignFund.isPending}
            >
              {assignFund.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('ASSIGNING')}
                </>
              ) : (
                t('ASSIGN_CASH')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <UnsavedChangesDialog
        open={showDialog}
        onConfirm={handleConfirmLeave}
        onCancel={handleCancelLeave}
        onDiscard={handleDiscardLeave}
        title={tGlobal('UNSAVED_TITLE')}
        description={tGlobal('UNSAVED_ALERT_DESCRIPTION')}
        cancelText={tGlobal('CANCEL_TEXT')}
        discardText={tGlobal('DISCARD_TEXT')}
        confirmText={tGlobal('CONFIRM_TEXT')}
      />
    </div>
  );
}

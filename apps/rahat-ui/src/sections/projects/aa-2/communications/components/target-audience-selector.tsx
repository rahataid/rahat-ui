import { useTranslations } from "next-intl";
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';

import React, { useState, useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@rahat-ui/shadcn/src/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@rahat-ui/shadcn/src/components/ui/command';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@rahat-ui/shadcn/src/utils';

// Mock options
const BENEFICIARY_OPTIONS = [
  { label: 'All Beneficiaries', value: 'all-ben', count: 1200, data: { name: 'All Beneficiaries' } },
  { label: 'High-risk Vulnerable Families', value: 'high-risk', count: 350, data: { name: 'High-risk Vulnerable Families' } },
  { label: 'Registered Cash Beneficiaries', value: 'cash', count: 850, data: { name: 'Registered Cash Beneficiaries' } },
  { label: 'Ward 1-5 Residents', value: 'w1-5', count: 420, data: { name: 'Ward 1-5 Residents' } }
];

const STAKEHOLDER_OPTIONS = [
  { label: 'All Stakeholders', value: 'all-stake', count: 45, data: { name: 'All Stakeholders' } },
  { label: 'Municipal Steering Committee', value: 'steering-committee', count: 12, data: { name: 'Municipal Steering Committee' } },
  { label: 'Field Staff', value: 'field-staff', count: 28, data: { name: 'Field Staff' } },
  { label: 'Red Cross Volunteers', value: 'red-cross', count: 15, data: { name: 'Red Cross Volunteers' } }
];

export function TargetAudienceSelector() {
  const t = useTranslations("AA_PROJECT");
  const formatDigits = useLabelDigits();
  const { watch, setValue, trigger, formState: { errors } } = useFormContext<any>();
  const [openBen, setOpenBen] = useState(false);
  const [openStake, setOpenStake] = useState(false);

  const selectedBeneficiaries = watch('beneficiaries') || [];
  const selectedStakeholders = watch('stakeholders') || [];

  const toggleBeneficiary = useCallback((option: any) => {
    const exists = selectedBeneficiaries.find((p: any) => p.id === option.value);
    let newVal;
    if (exists) newVal = selectedBeneficiaries.filter((p: any) => p.id !== option.value);
    else if (option.value === 'all-ben') {
      newVal = [{ ...option.data, id: option.value, count: option.count }];
    } else {
      const withoutAll = selectedBeneficiaries.filter((p: any) => p.id !== 'all-ben');
      newVal = [...withoutAll, { ...option.data, id: option.value, count: option.count }];
    }
    setValue('beneficiaries', newVal, { shouldValidate: true });
    // Manually trigger validation on the unified error path so the red border clears instantly
    trigger();
  }, [selectedBeneficiaries, setValue, trigger]);

  const toggleStakeholder = useCallback((option: any) => {
    const exists = selectedStakeholders.find((p: any) => p.id === option.value);
    let newVal;
    if (exists) newVal = selectedStakeholders.filter((p: any) => p.id !== option.value);
    else if (option.value === 'all-stake') {
      newVal = [{ ...option.data, id: option.value, count: option.count }];
    } else {
      const withoutAll = selectedStakeholders.filter((p: any) => p.id !== 'all-stake');
      newVal = [...withoutAll, { ...option.data, id: option.value, count: option.count }];
    }
    setValue('stakeholders', newVal, { shouldValidate: true });
    // Manually trigger validation on the unified error path so the red border clears instantly
    trigger();
  }, [selectedStakeholders, setValue, trigger]);

  const totalReach = useMemo(() => {
    const benCount = selectedBeneficiaries.reduce((sum: number, g: any) => sum + (g.count || 0), 0);
    const stakeCount = selectedStakeholders.reduce((sum: number, g: any) => sum + (g.count || 0), 0);
    return benCount + stakeCount;
  }, [selectedBeneficiaries, selectedStakeholders]);

  return (
    <div className="space-y-4 border rounded-md p-4 bg-slate-50">
      <div className="flex flex-col space-y-1">
        <Label className="text-base font-semibold">{t("TARGET_AUDIENCE")}</Label>
        {errors.targetAudience && (
          <p className="text-sm font-medium text-destructive">{errors.targetAudience.message as string}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="space-y-2 flex flex-col">
          <Label className="text-muted-foreground block mb-2">{t("BENEFICIARY_GROUP")}</Label>
          <Popover open={openBen} onOpenChange={setOpenBen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openBen}
                className={cn(
                  "w-full justify-between font-normal text-left",
                  errors.targetAudience && "shadow-[inset_4px_0_0_0_hsl(var(--destructive))] bg-red-50 focus-visible:ring-2 focus-visible:ring-destructive",
                  !errors.targetAudience && selectedBeneficiaries.length > 0 && "shadow-[inset_4px_0_0_0_hsl(var(--primary))] bg-blue-50"
                )}
              >
                {selectedBeneficiaries.length > 0
                  ? `${formatDigits(selectedBeneficiaries.length)} ${t("GROUPS_SELECTED")}`
                  : t("SEARCH_BENEFICIARY_GROUP")}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
              <Command>
                <CommandInput placeholder={t("SEARCH_BENEFICIARY_GROUP")} />
                <CommandList>
                  <CommandEmpty>{t("NO_GROUP_FOUND")}</CommandEmpty>
                  <CommandGroup>
                    {BENEFICIARY_OPTIONS.map((option) => (
                      <CommandItem key={option.value} value={option.label} onSelect={() => toggleBeneficiary(option)}>
                        <Check className={cn("mr-2 h-4 w-4", selectedBeneficiaries.find((p: any) => p.id === option.value) ? "opacity-100" : "opacity-0")} />
                        {option.label}
                        <span className="ml-auto text-xs text-muted-foreground">({formatDigits(option.count)})</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2 flex flex-col">
          <Label className="text-muted-foreground block mb-2">{t("STAKEHOLDER_GROUP")}</Label>
          <Popover open={openStake} onOpenChange={setOpenStake}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openStake}
                className={cn(
                  "w-full justify-between font-normal text-left",
                  errors.targetAudience && "shadow-[inset_4px_0_0_0_hsl(var(--destructive))] bg-red-50 focus-visible:ring-2 focus-visible:ring-destructive",
                  !errors.targetAudience && selectedStakeholders.length > 0 && "shadow-[inset_4px_0_0_0_hsl(var(--primary))] bg-blue-50"
                )}
              >
                {selectedStakeholders.length > 0
                  ? `${formatDigits(selectedStakeholders.length)} ${t("GROUPS_SELECTED")}`
                  : t("SEARCH_STAKEHOLDER_GROUP")}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
              <Command>
                <CommandInput placeholder={t("SEARCH_STAKEHOLDER_GROUP")} />
                <CommandList>
                  <CommandEmpty>{t("NO_GROUP_FOUND")}</CommandEmpty>
                  <CommandGroup>
                    {STAKEHOLDER_OPTIONS.map((option) => (
                      <CommandItem key={option.value} value={option.label} onSelect={() => toggleStakeholder(option)}>
                        <Check className={cn("mr-2 h-4 w-4", selectedStakeholders.find((p: any) => p.id === option.value) ? "opacity-100" : "opacity-0")} />
                        {option.label}
                        <span className="ml-auto text-xs text-muted-foreground">({formatDigits(option.count)})</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="pt-4 border-t mt-4">
        <Label className="text-sm font-semibold block mb-3">{t("SELECTED_AUDIENCE")}</Label>
        
        {selectedBeneficiaries.length === 0 && selectedStakeholders.length === 0 ? (
          <span className="text-sm text-muted-foreground italic">{t("NO_AUDIENCE_SELECTED_YET")}</span>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="flex flex-col space-y-2">
              <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">{t("BENEFICIARIES")}</Label>
              <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                {selectedBeneficiaries.length === 0 ? (
                  <span className="text-sm text-muted-foreground italic">{t("NONE_SELECTED")}</span>
                ) : (
                  selectedBeneficiaries.map((group: any) => (
                    <Badge key={group.id} variant="secondary" title={group.name} className="px-3 py-1 text-sm font-normal flex items-center max-w-[220px]">
                      <span className="truncate">{group.name}</span>
                      <span className="ml-1 opacity-70 shrink-0">({formatDigits(group.count)})</span>
                      <button type="button" onClick={() => toggleBeneficiary({ value: group.id })} className="ml-2 text-muted-foreground hover:text-foreground transition-colors shrink-0">×</button>
                    </Badge>
                  ))
                )}
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <Label className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">{t("STAKEHOLDERS")}</Label>
              <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                {selectedStakeholders.length === 0 ? (
                  <span className="text-sm text-muted-foreground italic">{t("NONE_SELECTED")}</span>
                ) : (
                  selectedStakeholders.map((group: any) => (
                    <Badge key={group.id} variant="outline" title={group.name} className="px-3 py-1 text-sm font-normal bg-white flex items-center max-w-[220px]">
                      <span className="truncate">{group.name}</span>
                      <span className="ml-1 opacity-70 shrink-0">({formatDigits(group.count)})</span>
                      <button type="button" onClick={() => toggleStakeholder({ value: group.id })} className="ml-2 text-muted-foreground hover:text-foreground transition-colors shrink-0">×</button>
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {(selectedBeneficiaries.length > 0 || selectedStakeholders.length > 0) && (
          <div className="mt-5 pt-3 border-t text-sm font-semibold flex justify-between items-center bg-card p-3 rounded-md shadow-sm">
            <span className="text-muted-foreground">{t("TOTAL_AUDIENCE_REACH")}</span>
            <span className="text-lg text-primary">{formatDigits(totalReach)} {t("INDIVIDUALS")}</span>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { AddPhaseFormInputValues, AddPhaseFormValues } from './phase.schema';

import { Switch } from '@rahat-ui/shadcn/src/components/ui/switch';
import {
  Form,
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
  FormItem,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import MultipleSelector, {
  Option,
} from '@rahat-ui/shadcn/src/components/custom/multi-select';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { capitalizeFirstLetter } from 'apps/rahat-ui/src/utils';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';

interface PhaseFormProps {
  form: UseFormReturn<AddPhaseFormInputValues, unknown, AddPhaseFormValues>;
  onSubmit: (data: AddPhaseFormValues) => Promise<void>;
  onReset: () => void;
  loading: boolean;
  submitLabel: string;
  resetLabel?: string;
  stationHeading: string;
  disbursementMethodOptions?: Option[];
  allPhases?: any[];
  currentPhaseId?: string;
}

export const PhaseForm: React.FC<PhaseFormProps> = ({
  form,
  onSubmit,
  onReset,
  loading,
  submitLabel,
  resetLabel = 'Clear',
  stationHeading,
  disbursementMethodOptions = [],
  allPhases = [],
  currentPhaseId,
}) => {
  const t = useTranslations('AA_PROJECT');
  const watchCanTriggerPayout = form.watch('canTriggerPayout');

  const methodOptions = useMemo(() => {
    return disbursementMethodOptions.map((opt) => {
      const usedByPhase = allPhases.find(
        (p: any) =>
          p.uuid !== currentPhaseId &&
          p.disbursementConfig?.disbursementMethods?.includes(opt.value),
      );
      return {
        ...opt,
        disable: !!usedByPhase,
        title: usedByPhase ? `Already used by ${usedByPhase.name}` : undefined,
      };
    });
  }, [disbursementMethodOptions, allPhases, currentPhaseId]);

  const allMethodsTaken = useMemo(() => {
    if (!disbursementMethodOptions.length) return false;
    return methodOptions.every((opt) => opt.disable);
  }, [methodOptions, disbursementMethodOptions.length]);

  const filterSelectedOptions = useCallback(
    (values: string[] | undefined) => {
      return disbursementMethodOptions.filter((o) => values?.includes(o.value));
    },
    [disbursementMethodOptions],
  );
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="p-4">
          <ScrollArea className="h-[calc(100vh-230px)] pr-2">
            <div className="rounded-xl border p-4 space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('PHASE_NAME')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('WRITE_PHASE_NAME')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="riverBasin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{stationHeading}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={stationHeading}
                        value={capitalizeFirstLetter(field.value)}
                        onChange={field.onChange}
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="requiredMandatoryTriggers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('MANDATORY_TRIGGERS')}*</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder={t('ENTER_MANDATORY_TRIGGERS')}
                          value={
                            typeof field.value === 'string' ||
                            typeof field.value === 'number'
                              ? field.value
                              : ''
                          }
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requiredOptionalTriggers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('OPTIONAL_TRIGGERS')}*</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder={t('ENTER_OPTIONAL_TRIGGERS')}
                          value={
                            typeof field.value === 'string' ||
                            typeof field.value === 'number'
                              ? field.value
                              : ''
                          }
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4  pt-3">
                <p className="text-sm font-medium">{t('OTHER_OPTIONS')}:</p>
                {/* Can Revert Toggle */}
                <div className="flex items-start justify-between border-b pb-4 ">
                  <div className="flex-1 pr-4">
                    <h4 className="font-semibold text-slate-900 text-sm mb-1">
                      {t('CAN_REVERT')}
                    </h4>
                    <p className="text-slate-600 text-sm">
                      {t('ALLOW_USER_TO_MANUALLY_REVERT_THIS')} {t('DROP_BELOW_THRESHOLDS')}
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="canRevert"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0  ">
                        <FormControl>
                          <Switch
                            id="canRevert"
                            checked={field.value === true}
                            onCheckedChange={(checked) => {
                              field.onChange(checked === true);
                            }}
                            className="flex-shrink-0"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Can Trigger Payout Toggle */}
                <div className="flex items-start justify-between border-b pb-4">
                  <div className="flex-1 pr-4">
                    <h4 className="font-semibold text-slate-900 text-sm mb-1">
                      {t('CAN_TRIGGER_PAYOUT')}
                    </h4>
                    <p className="text-slate-600 text-sm">
                      {t('AUTHORIZE_INITIATION_OF_DISBURSEMENTS_UPON_THE')} {t('OF_THIS_PHASE')}
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="canTriggerPayout"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0  ">
                        <FormControl>
                          <TooltipWrapper
                              tip={
                                allMethodsTaken
                                  ? t('ALL_DISBURSEMENT_METHODS_ALREADY_USED')
                                  : ''
                              }
                          >
                            <Switch
                              id="canTriggerPayout"
                              checked={field.value === true}
                              disabled={allMethodsTaken}
                              onCheckedChange={(checked) => {
                                field.onChange(checked === true);
                              }}
                              className="flex-shrink-0"
                            />
                          </TooltipWrapper>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Is Automated Activity Switch */}
                <div className="flex items-start justify-between pb-4 border-b">
                  <div className="flex-1 pr-4">
                    <h4 className="font-semibold text-slate-900 text-sm mb-1">
                      {t('IS_AUTOMATED_ACTIVITY')}
                    </h4>
                    <p className="text-slate-600 text-sm">
                      {t('ENABLE_AUTOMATED_ACTIVITIES_FOR_THIS_PHASE')}
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="isAutomatedActivity"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value === true}
                            onCheckedChange={(checked) =>
                              field.onChange(checked === true)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Lead Time */}
                <div className="flex items-start justify-between pb-4 border-b">
                  <div className="flex-1 pr-4">
                    <h4 className="font-semibold text-slate-900 text-sm mb-1">
                      {t('IS_LEAD_TIME_REQUIRED')}
                    </h4>
                    <p className="text-slate-600 text-sm">
                      {t('ENABLE_LEAD_TIME_FOR_ACTIVITIES_IN')}
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="isRequiredLeadTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center  space-x-2 space-y-0 ">
                        <FormControl>
                          <Switch
                            checked={field.value === true}
                            onCheckedChange={(checked) =>
                              field.onChange(checked === true)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {/* Disbursement Methods - Separate Section */}
              <div className="mt-4 ">
                {watchCanTriggerPayout && (
                  <FormField
                    control={form.control}
                    name="disbursementMethods"
                    render={({ field }) => (
                      <FormItem className=" flex  flex-col items-start w-full ">
                        <FormLabel>{t('DISBURSEMENT_METHODS')}</FormLabel>
                        <FormControl>
                          <MultipleSelector
                            value={filterSelectedOptions(field.value)}
                            onChange={(options: Option[]) => {
                              field.onChange(options.map((o) => o.value));
                            }}
                            options={methodOptions}
                            placeholder={t('SELECT_DISBURSEMENT_METHODS')}
                            hideClearAllButton
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-36"
                  onClick={onReset}
                  disabled={loading}
                >
                  {resetLabel}
                </Button>
                <Button type="submit" className="w-36" disabled={loading}>
                  {loading ? `${submitLabel}...` : submitLabel}
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      </form>
    </Form>
  );
};

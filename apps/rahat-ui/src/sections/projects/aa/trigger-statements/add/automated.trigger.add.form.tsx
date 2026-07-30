import * as React from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { UseFormReturn } from 'react-hook-form';
import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { UUID } from 'crypto';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';

type IProps = {
  form: UseFormReturn<
    {
      title: string;
      dataSource: string;
      isMandatory?: boolean | undefined;
      minLeadTimeDays: string;
      maxLeadTimeDays: string;
      probability: string;
    },
    any,
    undefined
  >;
};

export default function AddAutomatedTriggerForm({ form }: IProps) {
  const t = useTranslations('AA_PROJECT');
  const params = useParams();
  const projectId = params.id as UUID;
  const selectedPhase = JSON.parse(
    localStorage.getItem('selectedPhase') as string,
  );

  const dataSources = useProjectSettingsStore(
    (s) => s.settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.DATASOURCE],
  );

  const riverBasin = dataSources?.glofas?.location;

  return (
    <>
      <Form {...form}>
        <form>
          <div className="mt-4 grid gap-4 ">
            <FormItem className="w-full">
              <FormLabel>{t('SELECTED_PHASE')}</FormLabel>
              <FormControl>
                <Input type="text" value={selectedPhase.name} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
            <div className="w-full flex gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => {
                  return (
                    <FormItem className="w-full">
                      <FormLabel>{t('TRIGGER_TITLE')}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t('ENTER_TRIGGER_TITLE')}
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
                name="dataSource"
                render={({ field }) => {
                  return (
                    <FormItem className="w-full">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormLabel>{t('SOURCE')}</FormLabel>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('SELECT_SOURCE')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={'GLOFAS'}>{t('GLOFAS')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="w-full flex gap-4">
              <FormItem className="w-full">
                <FormLabel>{t('RIVER_BASIN')}</FormLabel>
                <FormControl>
                  <Input type="text" value={riverBasin} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>

            <div className="w-full flex gap-4">
              <FormField
                control={form.control}
                name="minLeadTimeDays"
                render={({ field }) => {
                  return (
                    <FormItem className="w-full">
                      <FormLabel>{t('MINIMUM_LEAD_TIME_DAYS')}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="decimal"
                          // pattern="[0-9]*[.,]?[0-9]*"
                          // title="Please enter positive number"
                          placeholder={t('ENTER_MINIMUM_LEAD_TIME_DAYS')}
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
                name="maxLeadTimeDays"
                render={({ field }) => {
                  return (
                    <FormItem className="w-full">
                      <FormLabel>{t('MAXIMUM_LEAD_TIME_DAYS')}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="decimal"
                          // pattern="[0-9]*[.,]?[0-9]*"
                          // title="Please enter positive number"
                          placeholder={t('ENTER_MAXIMUM_LEAD_TIME_DAYS')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            <FormField
              control={form.control}
              name="probability"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>{t('FORECAST_PROBABILITY')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="decimal"
                        // pattern="[0-9]*[.,]?[0-9]*"
                        // title="Please enter positive number"
                        placeholder={t('ENTER_FORECAST_PROBABILITY')}
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
              name="isMandatory"
              render={({ field }) => {
                return (
                  <div className="grid gap-2 pl-2">
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked)}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        {t('IS_MANDATORY_TRIGGER')}
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  </div>
                );
              }}
            />
          </div>
        </form>
      </Form>
    </>
  );
}

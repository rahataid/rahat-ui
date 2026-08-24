import { UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { Switch } from '@rahat-ui/shadcn/src/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { DurationData } from '../../activities/add/add.activity.view';

type IProps = {
  form: UseFormReturn<{
    title: string;
    isMandatory?: boolean;
    description?: string;
    leadTime?: string;
  }>;
  phase: any;
  stationHeading?: string;
};

export default function AddManualTriggerForm({
  form,
  phase,
  stationHeading,
}: IProps) {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  return (
    <>
      <Form {...form}>
        <form>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormItem className="w-full">
              <FormLabel>{t('PHASE')}</FormLabel>
              <FormControl>
                <Input
                  className="bg-gray-300"
                  type="text"
                  value={phase?.name}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormItem>
              <FormLabel>{stationHeading}</FormLabel>
              <FormControl>
                <Input
                  className="bg-gray-300"
                  type="text"
                  value={phase?.riverBasin}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => {
                return (
                  <FormItem
                    className={
                      phase?.isRequiredLeadTime ? 'w-full' : 'col-span-2 w-full'
                    }
                  >
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
            {phase?.isRequiredLeadTime && (
              <FormField
                control={form.control}
                name="leadTime"
                render={({ field }) => {
                  const raw = field.value?.trim() ?? '';
                  const unitMatch = raw.match(/(hours|days)/i);
                  const unit = unitMatch
                    ? unitMatch[0].toLowerCase()
                    : 'days';
                  const lead = raw.replace(/\s*(hours|days)\s*/i, '') || '';
                  return (
                    <FormItem className="w-full">
                      <FormLabel>{tg('LEAD_TIME')}</FormLabel>
                      <div className="grid grid-cols-4">
                        <Input
                          type="text"
                          placeholder={tg('ENTER_LEAD_TIME')}
                          className="col-span-3 rounded-r-none"
                          value={lead}
                          onChange={(e) => {
                            const newLead = e.target.value;
                            field.onChange(
                              newLead ? `${newLead} ${unit}` : '',
                            );
                          }}
                        />
                        <Select
                          value={unit}
                          onValueChange={(val) => {
                            field.onChange(
                              lead ? `${lead} ${val}` : '',
                            );
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-l-none">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DurationData.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            )}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => {
                return (
                  <FormItem className="col-span-2">
                    <FormLabel>{t('TRIGGER_DESCRIPTION')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('WRITE_TRIGGER_DESCRIPTION_HERE')}
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
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="ml-2">{t('OPTIONAL')}</FormLabel>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </>
  );
}

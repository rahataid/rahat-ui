'use client';

import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from 'libs/shadcn/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'libs/shadcn/src/components/ui/form';
import { Input } from 'libs/shadcn/src/components/ui/input';
import { Textarea } from 'libs/shadcn/src/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'libs/shadcn/src/components/ui/select';
import {
  buildInkindDetailsSchema,
  InkindDetailsValues,
  INKIND_TYPES,
  INKIND_TYPE_LABELS,
  NAME_MAX,
  DESCRIPTION_MAX,
} from '../schemas/inkind.validation';
import type { InkindFormData } from '../schemas/inkind.validation';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { toAsciiDigits } from 'apps/rahat-ui/src/utils/i18n/numeral';

const DEFAULT_VALUES: InkindDetailsValues = {
  name: '',
  description: '',
  type: '',
  quantity: '',
};

interface Props {
  formData: Partial<InkindFormData>;
  onNext: (data: InkindDetailsValues) => void;
  existingNames?: string[];
}

export default function InkindDetailsForm({
  formData,
  onNext,
  existingNames = [],
}: Props) {
  const tg = useTranslations('AA_PROJECT_WITH_GNOSIS');
  const tglob = useTranslations('GLOBAL');
  const tAA = useTranslations('AA_PROJECT');
  const formatNum = useNumberFormat();
  const InkindDetailsSchema = useMemo(
    () => buildInkindDetailsSchema(tAA),
    [tAA],
  );
  const form = useForm<InkindDetailsValues>({
    resolver: zodResolver(InkindDetailsSchema),
    defaultValues: {
      name: formData.name ?? DEFAULT_VALUES.name,
      description: formData.description ?? DEFAULT_VALUES.description,
      type: formData.type ?? DEFAULT_VALUES.type,
      quantity: formData.quantity ?? DEFAULT_VALUES.quantity,
    },
  });

  const { control, handleSubmit, reset, watch, setError } = form;

  const nameValue = watch('name');
  const descriptionValue = watch('description');

  const handleNext = (data: InkindDetailsValues) => {
    const trimmed = data.name.trim().toLowerCase();
    const duplicate = existingNames.some(
      (n) => n.trim().toLowerCase() === trimmed,
    );
    if (duplicate) {
      setError('name', {
        message: tg('AN_INKIND_ITEM_WITH_THIS_NAME_ALREADY_EXISTS'),
      });
      return;
    }
    onNext(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleNext)}>
        <div className="border rounded-sm p-4 flex flex-col space-y-4">
          <p className="text-base font-semibold">{tg('CREATE_INKIND')}</p>
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>{tg('INKIND_NAME')}</FormLabel>
                  <span
                    className={`text-xs ${
                      (nameValue?.length ?? 0) >= NAME_MAX
                        ? 'text-destructive'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {formatNum(nameValue?.length ?? 0)}/{formatNum(NAME_MAX)}
                  </span>
                </div>
                <FormControl>
                  <Input
                    placeholder={tg('E_G_RICE50KG_BAGS')}
                    maxLength={NAME_MAX}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>{tglob('DESCRIPTION')}</FormLabel>
                  <span
                    className={`text-xs ${
                      (descriptionValue?.length ?? 0) >= DESCRIPTION_MAX
                        ? 'text-destructive'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {formatNum(descriptionValue?.length ?? 0)}/
                    {formatNum(DESCRIPTION_MAX)}
                  </span>
                </div>
                <FormControl>
                  <Textarea
                    placeholder={tg('BRIEFLY_DESCRIBE_THIS_IN_KIND_ITEM')}
                    className="resize-none"
                    rows={3}
                    maxLength={DESCRIPTION_MAX}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="type"
            render={({ field }) => (
              <FormItem>
                  <FormLabel>{tg('INKIND_TYPE')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={tg('SELECT_TYPE')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {INKIND_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {tglob(t)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tg('INKIND_QUANTITY_OPTIONAL')}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={tg('ENTER_QUANTITY')}
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const val = toAsciiDigits(e.target.value).replace(
                        /\D/g,
                        '',
                      );
                      field.onChange(val);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end items-center">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => reset(DEFAULT_VALUES)}
                 className="px-10 rounded-sm w-40"
              >
                {tg('CLEAR')}
              </Button>
              <Button type="submit" className="px-10 rounded-sm w-40">
                {tg('CONFIRM')}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

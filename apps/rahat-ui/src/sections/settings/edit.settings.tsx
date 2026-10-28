'use client';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useGetRahatSettingByName,
  useRahatSettingUpdate,
} from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { FormField } from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Switch } from '@rahat-ui/shadcn/src/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { Minus, Plus } from 'lucide-react';
import React, { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

type SettingsData = {
  name: string;
  requiredFields: [];
  value: any;
  isReadOnly: boolean;
  isPrivate: boolean;
};

type IProps = {
  closeSecondPanel: () => void;
  settingData: SettingsData;
};

export default function EditSettings({
  closeSecondPanel,
  settingData,
}: IProps) {
  const t = useTranslations('SETTINGS_EDIT');
  const g = useTranslations('GLOBAL');
  const updateRahatSettings = useRahatSettingUpdate();
  const { data } = useGetRahatSettingByName(settingData?.name);
  const FormSchema = z.object({
    name: z.string().min(1, { message: t('NAME_IS_REQUIRED') }),
    field: z
      .array(
        z
          .object({
            value: z.object({
              key: z.string().min(1, { message: t('KEY_IS_REQUIRED') }),
              value: z.string().min(1, { message: t('VALUE_IS_REQUIRED') }),
            }),
          })
          .optional(),
      )
      .optional(),
    requiredFields: z.array(
      z.string().min(1, { message: t('REQUIRED_FIELDS_IS_REQUIRED') }),
    ),
    isReadOnly: z.boolean(),
    isPrivate: z.boolean(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: (data && data?.data?.name) || '',
      requiredFields:
        data && data?.data?.isPrivate ? [''] : data?.data?.requiredFields,

      field:
        data &&
        (data?.data?.isPrivate
          ? [{ value: { key: '', value: '' } }]
          : Object.keys(data?.data?.value).map((key) => ({
            value: {
              key: key,
              value: data?.data?.value?.[key],
            },
          }))),
      isPrivate: (data?.data?.isPrivate && data?.data?.isPrivate) || false,
      isReadOnly: data?.data?.isReadOnly || false,
    },
  });
  const { fields, append, remove } = useFieldArray({
    name: 'field',
    control: control,
    rules: {
      required: 'Please append at least 1 item',
    },
  });

  const appendField = () => {
    append({
      value: { key: '', value: '' },
    });
  };
  const handleEditSetting = async (data: z.infer<typeof FormSchema>) => {
    const result = data?.field?.reduce(
      (acc: any, item: any) => {
        acc.value[item.value.key] = item.value.value;
        return acc;
      },
      { value: {} },
    );

    const finalSettingData = {
      name: data.name,
      requiredFields: data.requiredFields,
      value: result.value,
      isReadOnly: data.isReadOnly,
      isPrivate: data.isPrivate,
    };
    await updateRahatSettings.mutateAsync(finalSettingData);
    closeSecondPanel();
  };

  useEffect(() => {
    reset({
      name: (data && data?.data?.name) || '',
      requiredFields:
        data && data?.data?.isPrivate ? [''] : data?.data?.requiredFields,

      field:
        data &&
        (data?.data?.isPrivate
          ? [{ value: { key: '', value: '' } }]
          : Object.keys(data?.data?.value).map((key) => ({
            value: {
              key: key,
              value: data?.data?.value[key],
            },
          }))),
      isPrivate: (data?.data?.isPrivate && data?.data?.isPrivate) || false,
      isReadOnly: data?.data?.isReadOnly || false,
    });
  }, [data, reset]);

  return (
    <div className="p-4 h-add rounded border bg-white">
      <div className="flex justify-between items-center p-4 pb-1">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <Label className="text-base">{g('EDIT')}</Label>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger onClick={closeSecondPanel}>
              <Minus size={20} strokeWidth={1.5} />
            </TooltipTrigger>
            <TooltipContent className="bg-secondary ">
              <p className="text-xs font-medium">{g('CLOSE')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <form onSubmit={handleSubmit(handleEditSetting)}>
        {/* <div className="p-4 h-add rounded border bg-white"> */}
        <div className="shadow-md p-4 rounded-sm border mt-5">
          <div className="grid grid-cols-5 gap-4 mb-4">
            <Label className="col-span-2">{g('NAME')}</Label>
            <Label className="col-span-2">{t('REQUIRED_FIELDS')}</Label>
          </div>
          <div className="grid grid-cols-5 gap-5 mb-4">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <div className="col-span-2">
                  <Input type="text" placeholder={g('NAME')} {...field} disabled />

                  {errors.name && (
                    <Label className="text-red-500">
                      {errors.name.message}
                    </Label>
                  )}
                </div>
              )}
            />

            <FormField
              control={control}
              name="requiredFields"
              render={({ field }) => (
                <div className="col-span-2">
                  <Input
                    type="text"
                    placeholder={t('COMMA_SEPARATED_KEYS_EG_KEY1_KEY2')}
                    {...field}
                    onChange={(e) => {
                      const uppercaseValue = e.target.value.toUpperCase();
                      field.onChange(
                        uppercaseValue.split(',').map((item) => item.trim()), // Remove leading and trailing whitespaces
                      );
                    }}
                  />
                  {errors.requiredFields &&
                    Array.isArray(errors.requiredFields) && (
                      <span className="text-red-500">
                        {errors?.requiredFields?.map((error, index) => (
                          <Label key={index}>{error?.message}</Label>
                        ))}
                      </span>
                    )}
                </div>
              )}
            />
            <div className="col-span-1 ">
              <div className="flex flex-col justify-center space-y-4">
                <FormField
                  control={control}
                  name="isReadOnly"
                  render={({ field }) => (
                    <div className=" flex flex-row justify-evenly">
                      <Label>{g('READONLY')}</Label>
                      <Switch
                        {...field}
                        value={field.value ? 'false' : 'true'}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />

                <FormField
                  control={control}
                  name="isPrivate"
                  render={({ field }) => (
                    <div className=" flex flex-row justify-evenly">
                      <Label>{g('PRIVATE')}</Label>
                      <Switch
                        {...field}
                        value={field.value ? 'true' : 'false'}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-4 mb-4">
            {fields.length > 0 && (
              <>
                <Label className="col-span-2">{t('KEY')}</Label>
                <Label className="col-span-2">{t('VALUE')}</Label>
              </>
            )}
          </div>
          <div className="grid grid-cols-5 gap-5 mb-4">
            {fields.map((fieldName, index) => {
              return (
                <React.Fragment key={fieldName.id}>
                  <FormField
                    control={control}
                    name={`field.${index}.value.key`}
                    render={({ field }) => (
                      <div className="col-span-2">
                        <Input
                          type="text"
                          placeholder={t('EG_CLIENT_ID')}
                          {...field}
                        />
                        {errors?.field?.[index]?.value?.key && (
                          <Label className="text-red-500">
                            {errors?.field[index]?.value?.key?.message}
                          </Label>
                        )}
                      </div>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`field.${index}.value.value`}
                    render={({ field }) => (
                      <div className="col-span-2">
                        <Input type="text" placeholder={t('VALUE2')} {...field} />
                        {errors?.field?.[index]?.value?.value && (
                          <Label className="text-red-500">
                            {errors?.field[index]?.value?.value?.message}
                          </Label>
                        )}
                      </div>
                    )}
                  />

                  <div className="flex justify-center">
                    <Button
                      type="button"
                      onClick={() => {
                        remove(index);
                      }}
                      className="p-1 text-xs  w-10"
                    >
                      <Minus size={18} strokeWidth={1.5} />
                    </Button>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          <Button
            onClick={appendField}
            type="button"
            className="flex items-center p-2 gap-1 text-xs  w-15"
          >
            <Plus size={18} strokeWidth={1.5} />
            {t('ADD_FIELD')}
          </Button>
          <div className="flex justify-end">
            <Button type="submit">{g('SAVE')}</Button>
          </div>
        </div>
        {/* </div> */}
      </form>
    </div>
  );
}

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Switch } from '@rahat-ui/shadcn/src/components/ui/switch';
import { Tag, TagInput } from 'emblor';
import { useFieldArray, useForm } from 'react-hook-form';

import { z } from 'zod';

import React, { useEffect, useState } from 'react';

import {
  useCommunitySettingList,
  useFieldDefinitionsCreate,
  useUploadStandardLevel,
} from '@rahat-ui/community-query';
import { FieldType } from 'apps/community-tool-ui/src/constants/fieldDefinition.const';
import { DownloadCloud, Minus, Plus } from 'lucide-react';
import Samples from '../samples.json';
import * as XLSX from 'xlsx';
import { usePagination } from '@rahat-ui/query';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';

type Iprops = {
  handleTabChange: (tab: 'add' | 'import') => void;
};

const DEFAULT_VALUES = {
  name: '',
  fieldType: FieldType.TEXT,
  isActive: true,
  isTargeting: false,
  variations: [],
  field: [],
};

export default function AddFieldDefinitions({ handleTabChange }: Iprops) {
  const addFieldDefinitions = useFieldDefinitionsCreate();
  const uploadStandardLevel = useUploadStandardLevel();
  const [showLabelValue, setShowLabelValue] = useState(false);

  const [variationTags, setVariationTags] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
  const {
    pagination,

    filters,
  } = usePagination();
  const debouncedFilters = useDebounce(filters, 500) as any;
  const { isLoading, data } = useCommunitySettingList({
    ...pagination,
    ...(debouncedFilters as any),
  });

  const findAiApiUrl = data?.data.find(
    (setting: any) => setting.name === 'AI_API_URL',
  );
  const aiBaseurl = findAiApiUrl?.value?.URL;

  const { control } = useForm();

  const FormSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    fieldType: z.string().toUpperCase(),
    isActive: z.boolean(),
    isTargeting: z.boolean(),
    variations: z.array(
      z.object({
        id: z.string(),
        text: z.string(),
      }),
    ),
    field: z.array(
      z.object({
        value: z.object({
          label: z.string().min(1, { message: 'Label is required' }).optional(),
          value: z.string().min(1, { message: 'Value is required' }).optional(),
        }),
      }),
    ),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const { fields, append, remove } = useFieldArray({
    name: 'field',
    control: control,
  });

  const { setValue } = form;

  const handleCreateFieldDefinitions = async (
    data: z.infer<typeof FormSchema>,
  ) => {
    try {
      let fieldPopulatePayload;
      if (data.field && data.field.length > 0) {
        fieldPopulatePayload = data.field.map((item: any) => ({
          label: item.value.label,
          value: item.value.value,
        }));
      }

      const variationNames = data.variations.length
        ? data.variations.map((d) => d.text)
        : [];

      const payload = {
        name: data.name,
        fieldType: data.fieldType as FieldType,
        isActive: true,
        isTargeting: data.isTargeting,
        variations: variationNames,
        fieldPopulate: { data: fieldPopulatePayload } || [],
      };

      await addFieldDefinitions.mutateAsync(payload);

      const aiPayload = {
        standard_name: 'community_data_standard',
        field_name: data.name,
        field_type: data.fieldType.toLowerCase(),
        field_description: `${data.name} field for beneficiary data`,
        is_active: true,
        validation_rules: {},
      };

      await uploadStandardLevel.mutateAsync({
        payload: aiPayload,
        baseURL: aiBaseurl,
      });

      form.reset();
    } catch (error) {
      console.error('Error creating field definition:', error);
      // You might want to show an error message to the user here
    }
  };

  const addLabelAndValue = () => {
    if (showLabelValue) {
      append({
        value: { label: '', value: '' },
      });
    }
  };

  useEffect(() => {
    setShowLabelValue(
      form.watch('fieldType') === FieldType.CHECKBOX ||
        form.watch('fieldType') === FieldType.RADIO ||
        form.watch('fieldType') === FieldType.DROPDOWN,
    );
  }, [form.watch('fieldType'), form]);

  useEffect(() => {
    if (addFieldDefinitions.isSuccess) {
      form.reset();
    }
  }, [addFieldDefinitions.isSuccess, form]);

  useEffect(() => {
    if (showLabelValue) {
      append({
        value: { label: '', value: '' },
      });
    } else {
      form.setValue('field', []);
    }
  }, [showLabelValue, append, form]);

  const handleSampleDownload = (e) => {
    e.preventDefault();
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(Samples);

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'FieldDefinitionSamples.xlsx');
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateFieldDefinitions)}>
        <div className="p-4 h-add overflow-scroll rounded border bg-white">
          <div style={{ justifyContent: 'space-between' }} className="flex">
            <div>
              <h1 className="text-lg ml-2 font-semibold mb-6">
                Add Field Definition
              </h1>
            </div>
            <div>
              <a
                href="#"
                onClick={() => handleTabChange('import')}
                className="font-medium mt-2 mr-2 text-blue-600 dark:text-blue-500 hover:underline"
              >
                Bulk Upload?
              </a>
            </div>
          </div>

          <div className="shadow-md p-4 rounded-sm">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input type="text" placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="variations"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <TagInput
                          {...field}
                          truncate={25}
                          activeTagIndex={activeTagIndex}
                          setActiveTagIndex={setActiveTagIndex}
                          placeholder="Enter value and press ENTER"
                          tags={variationTags}
                          className="min-h-[23px]"
                          setTags={(newTags: Tag) => {
                            setVariationTags(newTags);
                            setValue('variations', newTags as [Tag, ...Tag[]]);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="fieldType"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={FieldType.TEXT} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={FieldType.TEXT}>TEXT</SelectItem>
                          <SelectItem value={FieldType.NUMBER}>
                            NUMBER
                          </SelectItem>
                          <SelectItem value={FieldType.CHECKBOX}>
                            CHECKBOX
                          </SelectItem>
                          <SelectItem value={FieldType.DROPDOWN}>
                            DROPDOWN
                          </SelectItem>
                          <SelectItem value={FieldType.PASSWORD}>
                            PASSWORD
                          </SelectItem>
                          <SelectItem value={FieldType.RADIO}>RADIO</SelectItem>
                          <SelectItem value={FieldType.DATE}>DATE</SelectItem>
                          <SelectItem value={FieldType.TEXTAREA}>
                            TEXTAREA
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {showLabelValue && (
                <FormField
                  control={form.control}
                  name="isTargeting"
                  render={({ field }) => (
                    <div className="flex flex-row items-center gap-4 m-1">
                      <Label> Select as targeting criteria</Label>
                      <Switch
                        {...field}
                        value={field.value ? 'false' : 'true'}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />
              )}
            </div>
            {showLabelValue && (
              <>
                <div className="grid grid-cols-5 gap-4 mb-4">
                  {fields.length > 0 && (
                    <>
                      <Label className="col-span-2">LABEL</Label>
                      <Label className="col-span-2">VALUE</Label>
                    </>
                  )}
                </div>
                <div className="grid grid-cols-5 gap-5 mb-4">
                  {fields.map((fieldName, index) => {
                    return (
                      <React.Fragment key={fieldName.id}>
                        <FormField
                          control={form.control}
                          name={`field.${index}.value.label`}
                          render={({ field }) => (
                            <div className="col-span-2">
                              <Input
                                type="text"
                                placeholder="eg: Green"
                                {...field}
                              />
                            </div>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`field.${index}.value.value`}
                          render={({ field }) => (
                            <div className="col-span-2">
                              <Input
                                type="text"
                                placeholder="eg: GREEN"
                                {...field}
                              />
                              {/* {errors?.fieldPopulate?.[index]?.value?.value && (
                                <Label className="text-red-500">
                                  {errors?.fieldPopulate?.[index]?.value?.value?.message}
                                </Label>
                              )} */}
                            </div>
                          )}
                        />

                        <div className="flex justify-center">
                          <Button
                            type="button"
                            onClick={() => remove(index)}
                            className="p-1 text-xs  w-10"
                            // disabled={fields.length === 0}
                          >
                            <Minus size={18} strokeWidth={1.5} />
                          </Button>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>

                <Button
                  onClick={addLabelAndValue}
                  type="button"
                  className="flex items-center p-2 gap-1 text-xs  w-15"
                >
                  <Plus size={18} strokeWidth={1.5} />
                  Add Field
                </Button>
              </>
            )}

            <div className="flex justify-end mb-10 space-x-4">
              <Button
                onClick={(e) => handleSampleDownload(e)}
                className=" text-blue-700 bg-gray-300 hover:bg-gray-300 "
              >
                <DownloadCloud size={18} strokeWidth={1.5} className="mr-1" />
                Download Sample
              </Button>

              <Button type="submit">Submit</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

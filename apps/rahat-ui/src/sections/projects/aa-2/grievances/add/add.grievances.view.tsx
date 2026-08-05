import { zodResolver } from '@hookform/resolvers/zod';
import { useGrievanceAdd } from '@rahat-ui/query';
import {
  GrievancePriority,
  GrievanceStatus,
  GrievanceType,
} from '@rahat-ui/query/lib/grievance/types/grievance';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  RadioGroup,
  RadioGroupItem,
} from '@rahat-ui/shadcn/src/components/ui/radio-group';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useUserStore } from '@rumsan/react-query';
import { Back, Heading } from 'apps/rahat-ui/src/common';
import {
  grievancePriority,
  grievanceStatus,
  grievanceType,
} from 'apps/rahat-ui/src/constants/aa.grievances.constants';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { Tag, TagInput } from 'emblor';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { toAsciiDigits } from 'apps/rahat-ui/src/utils/numeral.utils';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/useNumberFormat';

export default function AddGrievances() {
  const t = useTranslations('AA_PROJECT');
  const labelMap: Record<string, string> = {
    'Technical': t('TECHNICAL'),
    'Non-Technical': t('NON_TECHNICAL'),
    'Other': t('OTHER'),
    'New': t('NEW'),
    'Under Review': t('UNDER_REVIEW'),
    'Resolved': t('RESOLVED'),
    'Closed': t('CLOSED'),
    'Low': t('LOW'),
    'Medium': t('MEDIUM'),
    'High': t('HIGH'),
  };
  const { id: projectID } = useParams();
  const router = useRouter();
  const [formKey, setFormKey] = React.useState(0);
  const forceRerender = () => setFormKey((prev) => prev + 1);
  const grievancesListPath = `/projects/aa/${projectID}/grievances`;
  const addGrievance = useGrievanceAdd();

  // Custom validation for email or phone number. Devanagari numerals are
  // normalized to ASCII before the check runs, so a phone number typed in
  // Nepali digits validates and submits correctly.
  const emailOrPhone = z.preprocess(
    (raw) => {
      if (typeof raw !== 'string') return raw;
      const asciiValue = toAsciiDigits(raw);
      // Strip spaces/hyphens used as visual separators in a typed phone
      // number (e.g. "974 6473456" -> "9746473456"), but leave email
      // addresses untouched since hyphens are valid there.
      return asciiValue.includes('@')
        ? asciiValue
        : asciiValue.replace(/[\s-]/g, '');
    },
    z.string().refine(
      (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10,15}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      },
      {
        message: t('PLEASE_ENTER_VALID_EMAIL_OR_PHONE'),
      },
    ),
  );

  const FormSchema = z.object({
    reportedBy: z
      .string()
      .min(1, { message: t('REPORTER_NAME_IS_REQUIRED') })
      .max(100, { message: t('REPORTER_NAME_MAX_100') }),

    reporterContact: emailOrPhone,

    title: z
      .string()
      .min(5, { message: t('TITLE_MUST_BE_5_CHARACTERS') })
      .max(100, { message: t('TITLE_MAX_100_CHARACTERS') }),

    type: z.nativeEnum(GrievanceType, {
      required_error: t('PLEASE_SELECT_GRIEVANCE_TYPE'),
    }),

    description: z
      .string()
      .min(10, { message: t('DESCRIPTION_MUST_BE_10_CHARACTERS') })
      .max(1000, { message: t('DESCRIPTION_MAX_1000_CHARACTERS') }),

    status: z
      .nativeEnum(GrievanceStatus, {
        required_error: t('STATUS_IS_REQUIRED'),
      })
      .default(GrievanceStatus.NEW),

    priority: z.nativeEnum(GrievancePriority, {
      required_error: t('PLEASE_SELECT_GRIEVANCE_PRIORITY'),
    }),

    tags: z.array(z.object({ id: z.string(), text: z.string() })).optional(),
  });

  type FormValues = z.infer<typeof FormSchema>;

  const formatLabel = useLabelDigits();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      reportedBy: '',
      reporterContact: '',
      title: '',
      description: '',
      status: GrievanceStatus.NEW,
      type: undefined,
      priority: undefined,
      tags: [],
    },
    mode: 'onChange',
  });

  const handleCreateGrievance: import('react-hook-form').SubmitHandler<
    FormValues
  > = async (data) => {
    try {
      // Ensure all required fields are present with proper types
      const payload = {
        ...data,
        status: data.status || GrievanceStatus.NEW,
        tags: data?.tags?.map((tag) => tag.text) || [],
      };

      await addGrievance.mutateAsync({
        projectUUID: projectID as UUID,
        grievancePayload: payload,
      });

      // Reset form after successful submission with default values
      form.reset({
        reportedBy: '',
        reporterContact: '',
        title: '',
        type: undefined,
        description: '',
        status: GrievanceStatus.NEW,
        priority: undefined,
        tags: [],
      });
      setVariationTags([]);
      setUnsavedTag('');
      setActiveTagIndex(null);

      router.push(grievancesListPath);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleResetForm = () => {
    form.reset({
      reportedBy: '',
      reporterContact: '',
      title: '',
      description: '',
      status: GrievanceStatus.NEW,
      type: undefined,
      priority: undefined,
      tags: [],
    });
    setVariationTags([]);
    setUnsavedTag('');
    setActiveTagIndex(null);
    forceRerender();
  };

  const [variationTags, setVariationTags] = React.useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = React.useState<number | null>(
    null,
  );
  const [unsavedTag, setUnsavedTag] = React.useState<string>('');

  const handleSupportAreaKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter') {
      // Prevent form submission on Enter
      e.preventDefault();
      if (unsavedTag.trim() !== '') {
        const newTag: Tag = {
          id: new Date().getTime().toString(),
          text: unsavedTag.trim(),
        };
        const updatedTags = [...variationTags, newTag];
        setVariationTags(updatedTags);
        form.setValue('tags', updatedTags as [Tag, ...Tag[]]);
        setUnsavedTag('');
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateGrievance)}>
        <div className="p-4">
          <div className=" mb-2 flex flex-col space-y-0">
            <Back path={grievancesListPath} />

            <div className="mt-4 flex justify-between items-center">
              <div>
                <Heading
                  title={t('CREATE_GRIEVANCE')}
                  description={t('FILL_THE_FORM_BELOW_TO_CREATE_NEW_GRIEVANCE')}
                />
              </div>

              <div className="flex justify-end mt-8">
                <div className="flex gap-2"></div>
              </div>
            </div>
          </div>
          <ScrollArea className=" h-[calc(100vh-230px)]">
            <div className="rounded-xl border p-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>{t('GRIEVANCE_TITLE')} *</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={t('WRITE_GRIEVANCE_TITLE')}
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
                  name="description"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>{t('DESCRIPTION')} *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t('PROVIDE_DETAILED_INFORMATION')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    key={`type-${formKey}`}
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('GRIEVANCE_TYPE')} *</FormLabel>
                        <Select
                          onValueChange={(value: string) =>
                            field.onChange(value as GrievanceType)
                          }
                          value={field.value || ''}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('SELECT_GRIEVANCE_TYPE')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {grievanceType.map((item) => (
                              <SelectItem
                                key={item.value}
                                value={item.value as GrievanceType}
                              >
                                {labelMap[item.label] || item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('STATUS')} *</FormLabel>
                        <Select
                          onValueChange={(value: string) =>
                            field.onChange(value as GrievanceStatus)
                          }
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t('SELECT_GRIEVANCE_STATUS')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {grievanceStatus.map((item) => (
                              <SelectItem
                                key={item.value}
                                value={item.value as GrievanceStatus}
                              >
                                {labelMap[item.label] || item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    key={`priority-${formKey}`}
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>{t('PRIORITY')} *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value: string) =>
                              field.onChange(value as GrievancePriority)
                            }
                            value={field.value ?? ''}
                            className="flex space-x-1"
                          >
                            {grievancePriority.map((item) => (
                              <FormItem
                                key={item.value}
                                className="flex items-center space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <RadioGroupItem
                                    value={item.value as GrievancePriority}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {labelMap[item.label] || item.label}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="reportedBy"
                    render={({ field }) => {
                      return (
                        <FormItem>
                        <FormLabel>{t('REPORTER_NAME')} *</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={t('ENTER_REPORTER_NAME')}
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
                    name="reporterContact"
                    render={({ field }) => {
                      const isEmail =
                        typeof field.value === 'string' &&
                        field.value.includes('@');
                      return (
                        <FormItem>
                        <FormLabel>{t('CONTACT_INFORMATION')} *</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={t('WRITE_REPORTER_CONTACT')}
                            {...field}
                            value={
                              isEmail ? field.value : formatLabel(field.value)
                            }
                            onChange={(e) =>
                              field.onChange(toAsciiDigits(e.target.value))
                            }
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
                  name="tags"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <Label>{t('TAGS')}</Label>
                        <FormControl>
                          <>
                            <TagInput
                              {...field}
                              tags={variationTags}
                              setTags={(newTags) => {
                                setVariationTags(newTags);
                                form.setValue(
                                  'tags',
                                  newTags as [Tag, ...Tag[]],
                                );
                              }}
                              placeholder={t('ENTER_TAG_AND_PRESS_ENTER')}
                              className="min-h-[23px]"
                              styleClasses={{
                                inlineTagsContainer:
                                  'border-input rounded shadow-xs p-1 gap-1 ' +
                                  'focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500',
                                input:
                                  'w-full rounded-sm min-w-[80px] shadow-none px-2 h-7',
                                tag: {
                                  body: 'h-7 relative rounded-sm border border-input font-medium text-xs ps-2 pe-7',
                                  closeButton:
                                    'absolute -inset-y-px -end-px p-0 rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-muted-foreground/80 hover:text-foreground',
                                },
                              }}
                              activeTagIndex={activeTagIndex}
                              setActiveTagIndex={setActiveTagIndex}
                              inputProps={{
                                value: unsavedTag,
                                onChange: (
                                  e: React.ChangeEvent<HTMLInputElement>,
                                ) => setUnsavedTag(e.target.value),
                                onKeyDown: handleSupportAreaKeyDown,
                              }}
                            />
                            {unsavedTag && (
                              <span className="text-sm text-red-400 ml-1">
                                {t('PRESS_ENTER_TO_ADD')}
                              </span>
                            )}
                          </>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-10">
              <Button
                type="button"
                variant="outline"
                className="w-36"
                onClick={handleResetForm}
              >
                {t('CLEAR')}
              </Button>
              <Button className="w-36" type="submit" disabled={false}>
                {t('CREATE')}
              </Button>
            </div>
          </ScrollArea>
        </div>
      </form>
    </Form>
  );
}

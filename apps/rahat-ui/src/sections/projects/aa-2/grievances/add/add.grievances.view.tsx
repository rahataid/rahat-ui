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
import { z } from 'zod';
import { X } from 'lucide-react';
import { Tag, TagInput } from 'emblor';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';

export default function AddGrievances() {
  const { id: projectID } = useParams();
  const router = useRouter();
  const { user } = useUserStore((state) => ({
    user: state.user,
  }));
  const [formKey, setFormKey] = React.useState(0);
  const forceRerender = () => setFormKey((prev) => prev + 1);
  const grievancesListPath = `/projects/aa/${projectID}/grievances`;
  const addGrievance = useGrievanceAdd();

  // Custom validation for email or phone number
  const emailOrPhone = z.string().refine(
    (value) => {
      // Check if it's a valid email or a valid phone number (minimum 10 digits)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]{10,15}$/; // Assuming phone numbers are 10-15 digits
      return emailRegex.test(value) || phoneRegex.test(value);
    },
    {
      message: 'Please enter a valid email or phone number',
    },
  );

  const FormSchema = z.object({
    reportedBy: z
      .string()
      .min(1, { message: 'Reporter name is required' })
      .max(100, { message: 'Reporter name must be less than 100 characters' }),

    reporterContact: emailOrPhone,

    title: z
      .string()
      .min(5, { message: 'Title must be at least 5 characters' })
      .max(100, { message: 'Title must be less than 100 characters' }),

    type: z.nativeEnum(GrievanceType, {
      required_error: 'Please select a grievance type',
    }),

    description: z
      .string()
      .min(10, { message: 'Description must be at least 10 characters' })
      .max(1000, { message: 'Description must be less than 1000 characters' }),

    status: z
      .nativeEnum(GrievanceStatus, {
        required_error: 'Status is required',
      })
      .default(GrievanceStatus.NEW),

    priority: z.nativeEnum(GrievancePriority, {
      required_error: 'Please select a grievance priority',
    }),

    tags: z.array(z.object({ id: z.string(), text: z.string() })).optional(),
  });

  type FormValues = z.infer<typeof FormSchema>;

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
        reporterUserId: user?.data?.id,
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
                  title={`Create Grievance`}
                  description="Fill the form below to create new grievance"
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
                        <FormLabel>Grievance Title *</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Write grievance title"
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
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide the detailed information about the grievance"
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
                        <FormLabel>Grievance Type *</FormLabel>
                        <Select
                          onValueChange={(value: string) =>
                            field.onChange(value as GrievanceType)
                          }
                          value={field.value || ''}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Grievance Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {grievanceType.map((item) => (
                              <SelectItem
                                key={item.value}
                                value={item.value as GrievanceType}
                              >
                                {item.label}
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
                        <FormLabel>Status *</FormLabel>
                        <Select
                          onValueChange={(value: string) =>
                            field.onChange(value as GrievanceStatus)
                          }
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Grievance Status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {grievanceStatus.map((item) => (
                              <SelectItem
                                key={item.value}
                                value={item.value as GrievanceStatus}
                              >
                                {item.label}
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
                        <FormLabel>Priority *</FormLabel>
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
                                  {item.label}
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
                          <FormLabel>Reporter Name *</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter reporter name"
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
                      return (
                        <FormItem>
                          <FormLabel>Contact Information *</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Write reporter's contact information"
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
                  name="tags"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <Label>Tags</Label>
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
                              placeholder={
                                'Enter Tag and press ENTER to continue'
                              }
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
                                Press Enter to add.
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
                Clear
              </Button>
              <Button className="w-36" type="submit" disabled={false}>
                Create
              </Button>
            </div>
          </ScrollArea>
        </div>
      </form>
    </Form>
  );
}

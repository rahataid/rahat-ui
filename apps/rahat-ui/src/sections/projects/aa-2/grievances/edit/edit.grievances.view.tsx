'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useGrievanceDetails, useGrievanceEdit } from '@rahat-ui/query';
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
import { useUserStore } from '@rumsan/react-query';
import { Back, Heading } from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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

const grievanceFormSchema = z.object({
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
});

type GrievanceFormValues = z.infer<typeof grievanceFormSchema>;

const grievanceTypes = [
  { value: GrievanceType.TECHNICAL, label: 'Technical' },
  { value: GrievanceType.OPERATIONAL, label: 'Operational' },
  { value: GrievanceType.FINANCIAL, label: 'Financial' },
  { value: GrievanceType.OTHER, label: 'Other' },
];

const grievanceStatuses = [
  { value: GrievanceStatus.NEW, label: 'New' },
  { value: GrievanceStatus.IN_PROGRESS, label: 'In Progress' },
  { value: GrievanceStatus.RESOLVED, label: 'Resolved' },
  { value: GrievanceStatus.CLOSED, label: 'Closed' },
  { value: GrievanceStatus.REJECTED, label: 'Rejected' },
];

const grievancePriorities = [
  { value: GrievancePriority.LOW, label: 'Low' },
  { value: GrievancePriority.MEDIUM, label: 'Medium' },
  { value: GrievancePriority.HIGH, label: 'High' },
  { value: GrievancePriority.CRITICAL, label: 'Critical' },
];

export default function EditGrievance() {
  const router = useRouter();
  const params = useParams();
  const user = useUserStore();

  const projectID = params?.id as UUID;
  const grievanceID = params?.uuid as UUID;
  console.log('pramsxxx', params);
  console.log('projectIDxxx', projectID);
  console.log('grievanceIDxxx', grievanceID);
  const grievanceListPath = `/projects/aa/${projectID}/grievances`;

  // Fetch grievance details
  const { data: grievanceData, isLoading } = useGrievanceDetails({
    projectUUID: projectID,
    grievanceUUID: grievanceID,
  });

  // Initialize form
  const form = useForm<GrievanceFormValues>({
    resolver: zodResolver(grievanceFormSchema),
    defaultValues: {
      reportedBy: '',
      reporterContact: '',
      title: '',
      description: '',
      type: GrievanceType.OTHER,
      status: GrievanceStatus.NEW,
      priority: GrievancePriority.MEDIUM,
    },
  });

  // Update form with fetched data
  React.useEffect(() => {
    if (grievanceData?.data) {
      const {
        reportedBy,
        reporterContact,
        title,
        description,
        type,
        status,
        priority,
      } = grievanceData.data;
      form.reset({
        reportedBy: reportedBy || '',
        reporterContact: reporterContact || '',
        title: title || '',
        description: description || '',
        type: type || GrievanceType.OTHER,
        status: status || GrievanceStatus.NEW,
        priority: priority || GrievancePriority.MEDIUM,
      });
    }
  }, [grievanceData, form]);

  // Form key to force re-render when needed
  const [formKey, setFormKey] = React.useState(0);

  // Handle form reset
  const handleResetForm = React.useCallback(() => {
    if (grievanceData?.data) {
      const {
        reportedBy,
        reporterContact,
        title,
        description,
        type,
        status,
        priority,
      } = grievanceData.data;

      // First, reset the form with the original values
      form.reset({
        reportedBy: reportedBy || '',
        reporterContact: reporterContact || '',
        title: title || '',
        description: description || '',
        type: type || GrievanceType.OTHER,
        status: status || GrievanceStatus.NEW,
        priority: priority || GrievancePriority.MEDIUM,
      });

      // Then force a re-render to ensure UI updates
      setFormKey((prev) => prev + 1);
    }
  }, [form, grievanceData?.data]);

  // Initial form setup when data loads
  React.useEffect(() => {
    if (grievanceData?.data) {
      handleResetForm();
    }
  }, [grievanceData, handleResetForm]);

  // Update grievance mutation
  const updateGrievance = useGrievanceEdit();

  // Handle form submission
  const onSubmit = async (data: GrievanceFormValues) => {
    try {
      await updateGrievance.mutateAsync({
        projectUUID: projectID,
        grievancePayload: {
          ...data,
          uuid: grievanceID,
        },
      });
      router.push(grievanceListPath);
    } catch (error) {
      console.error('Error updating grievance:', error);
    }
  };

  if (isLoading || !grievanceData?.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="">
      <Form {...form} key={formKey}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="p-4">
            <div className=" mb-2 flex flex-col space-y-0">
              <Back path={grievanceListPath} />

              <div className="mt-4 flex justify-between items-center">
                <div>
                  <Heading
                    title={`Edit Grievance`}
                    description="Fill the form below to update grievance"
                  />
                </div>
              </div>
            </div>
            <ScrollArea className=" h-[calc(100vh-230px)]">
              <div className="rounded-xl border p-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="reportedBy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reporter Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter reporter's name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reporterContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Information</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter reporter's contact information"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter grievance title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide the detailed information about the grievance"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {grievanceTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
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
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {grievanceStatuses.map((status) => (
                              <SelectItem
                                key={status.value}
                                value={status.value}
                              >
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Priority */}
                  <FormField
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
                            {grievancePriorities.map((item) => (
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
              </div>
              <div className="flex justify-end space-x-4 mt-10">
                <Button
                  type="button"
                  variant="outline"
                  className="w-36"
                  onClick={handleResetForm}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  disabled={updateGrievance.isPending}
                  className="w-36"
                >
                  {updateGrievance.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </ScrollArea>
          </div>
        </form>
      </Form>
    </div>
  );
}

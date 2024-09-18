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
import { useRouter } from 'next/navigation';
import { useForm, Control } from 'react-hook-form';
import { z } from 'zod';
import { useParams } from 'next/navigation';
import { enumToObjectArray } from '@rumsan/sdk/utils';
import { Grievance, GrievanceStatus, GrievanceType } from '@rahataid/sdk';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { useGrievanceAdd } from '@rahat-ui/query';

// Step 1: Update the Form Schema
const FormSchema = z.object({
  reportedBy: z
    .string()
    .min(2, { message: 'Name must be at least 4 characters' }),
  contactInfo: z.string().optional(),
  grievanceTitle: z
    .string()
    .max(30, { message: 'Grievance Title cannot exceed 30 characters' }),
  grievanceType: z.string({ required_error: 'Please select grievance type.' }),
  description: z.string().min(4, { message: 'Must be at least 4 characters' }),
  status: z.string().optional(), // New field for status
});

type FormData = z.infer<typeof FormSchema>;

interface GrievanceFieldProps {
  control: Control<FormData>;
  name: keyof FormData;
  placeholder: string;
  type?: string;
}

interface GrievanceSelectFieldProps {
  control: Control<FormData>;
  name: keyof FormData;
  options: { value: string; label: string }[];
}

interface GrievanceFormProps {
  form: ReturnType<typeof useForm<FormData>>;
  handleSubmit: (data: FormData) => void;
  handleGoBack: () => void;
}

// Step 2: Define Status Options
const statusOptions = [
  { value: 'NEW', label: 'New' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'REJECTED', label: 'Rejected' },
];

const grievanceTypeOptions = enumToObjectArray(GrievanceType).map((type) => ({
  ...type,
  label: type.label.split('_').join(' '),
}));

function GrievanceField({
  control,
  name,
  placeholder,
  type = 'text',
}: GrievanceFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function GrievanceSelectField({
  control,
  name,
  options,
}: GrievanceSelectFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function GrievanceForm({
  form,
  handleSubmit,
  handleGoBack,
}: GrievanceFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="p-4 h-add bg-card">
          <div className="shadow-md p-4 rounded-sm">
            <h1 className="text-lg font-semibold mb-6">Edit Grievance</h1>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <GrievanceField
                control={form.control}
                name="reportedBy"
                placeholder="Reported by"
              />
              <GrievanceField
                control={form.control}
                name="contactInfo"
                placeholder="Reporter Contact Info"
              />
              <GrievanceField
                control={form.control}
                name="grievanceTitle"
                placeholder="Grievance Title"
              />
              <GrievanceSelectField
                control={form.control}
                name="grievanceType"
                options={grievanceTypeOptions}
              />
              <GrievanceField
                control={form.control}
                name="description"
                placeholder="Description"
              />
              {/* Step 3: Add the Status Dropdown */}
              <GrievanceSelectField
                control={form.control}
                name="status"
                options={statusOptions}
              />
            </div>
            <div className="flex justify-between">
              <Button
                variant="ghost"
                className="text-primary"
                type="button"
                onClick={handleGoBack}
              >
                Go Back
              </Button>
              <Button type="submit">Edit Grievance</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default function GrievanceAdd() {
  const router = useRouter();
  const addGrievance = useGrievanceAdd();
  const { id } = useParams();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      reportedBy: '',
      contactInfo: '',
      grievanceTitle: '',
      grievanceType: '',
      description: '',
      status: 'NEW', // Set default status to 'NEW'
    },
  });

  const handleGoBack = () => {
    router.back();
  };

  const handleCreateGrievance = async (data: FormData) => {
    const grievance: Grievance = {
      reportedBy: data?.reportedBy,
      reporterContact: data?.contactInfo ?? '',
      title: data?.grievanceTitle ?? '',
      type: data?.grievanceType,
      description: data?.description,
      projectId: id,
      status: data?.status as GrievanceStatus, // Use the status from the form
    };

    router.back();
    await addGrievance.mutateAsync(grievance);
  };

  return (
    <GrievanceForm
      form={form}
      handleSubmit={handleCreateGrievance}
      handleGoBack={handleGoBack}
    />
  );
}

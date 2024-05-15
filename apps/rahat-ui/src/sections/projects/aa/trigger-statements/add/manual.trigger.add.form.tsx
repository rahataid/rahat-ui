import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
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
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { useActivitiesStore, useCreateTriggerStatement } from '@rahat-ui/query';
import { UUID } from 'crypto';

export default function AddManualTriggerForm() {
  const { id: projectID } = useParams();
  const { hazardTypes, phases } = useActivitiesStore((state) => ({
    hazardTypes: state.hazardTypes,
    phases: state.phases,
  }));
  const createTriggerStatement = useCreateTriggerStatement();

  const FormSchema = z.object({
    title: z.string().min(2, { message: 'Please enter valid title' }),
    notes: z.string().min(5, { message: 'Must be at least 5 characters' }),
    phaseId: z.string().min(1, { message: 'Please select phase' }),
    hazardTypeId: z.string().min(1, { message: 'Please select hazard type' }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      notes: '',
      phaseId: '',
      hazardTypeId: '',
    },
  });

  const handleCreateTriggerStatement = async (
    data: z.infer<typeof FormSchema>,
  ) => {
    try {
      await createTriggerStatement.mutateAsync({
        projectUUID: projectID as UUID,
        triggerStatementPayload: { ...data, dataSource: 'MANUAL' },
      });
    } catch (e) {
      console.error('Create Manual Trigger Error::', e);
    } finally {
      form.reset();
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreateTriggerStatement)}>
          <div className="mt-4 grid gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <FormLabel>Trigger Title</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Trigger Title"
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
              name="phaseId"
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormLabel>Phase</FormLabel>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Phase" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {phases
                          .filter((phase) => phase.name !== 'PREPAREDNESS')
                          .map((item) => (
                            <SelectItem key={item.id} value={item.uuid}>
                              {item.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="hazardTypeId"
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormLabel>Hazard Type</FormLabel>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Hazard Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hazardTypes?.map((d: any) => {
                          return (
                            <SelectItem key={d.id} value={d.uuid}>
                              {d.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <FormLabel>Trigger Title</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter Trigger Notes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="flex justify-end mt-8">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                className="bg-red-100 text-red-600 w-36"
              >
                Cancel
              </Button>
              <Button type="submit">Add Trigger Statement</Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}

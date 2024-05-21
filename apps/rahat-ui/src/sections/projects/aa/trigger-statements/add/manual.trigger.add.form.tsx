import Link from 'next/link';
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { useActivitiesStore, useCreateTriggerStatement } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { Plus, X } from 'lucide-react';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';

type IProps = {
  next: VoidFunction
}

export default function AddManualTriggerForm({ next }: IProps) {
  const params = useParams();
  const projectId = params.id as UUID
  const phaseId = ''
  const { hazardTypes, phases } = useActivitiesStore((state) => ({
    // activities: state.activities,
    hazardTypes: state.hazardTypes,
    phases: state.phases,
  }));
  const createTriggerStatement = useCreateTriggerStatement();

  const FormSchema = z.object({
    title: z.string().min(2, { message: 'Please enter valid title' }),
    // notes: z.string().min(5, { message: 'Must be at least 5 characters' }),
    // phaseId: z.string().min(1, { message: 'Please select phase' }),
    hazardTypeId: z.string().min(1, { message: 'Please select hazard type' }),
    // activity: z
    //   .array(
    //     z.object({
    //       uuid: z.string(),
    //       title: z.string(),
    //     }),
    //   )
    //   .refine(
    //     (value) =>
    //       value.length > 0 && value.every((item) => item.uuid && item.title),
    //     {
    //       message: 'You have to select at least one activity',
    //     },
    //   ),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      // notes: '',
      // phaseId: '',
      hazardTypeId: '',
      // activity: [],
    },
  });

  const handleCreateTriggerStatement = async (
    data: z.infer<typeof FormSchema>,
  ) => {
    // const activities = data.activity.map((activity) => ({
    //   uuid: activity.uuid,
    // }));

    // const payload = {
    //   title: data.title,
    //   hazardTypeId: data.hazardTypeId,
    //   phaseId: data.phaseId,
    //   // activities: activities,
    //   dataSource: 'MANUAL',
    // };

    const payload = { ...data, phaseId: phaseId }
    console.log('payload::', payload)
    try {
      await createTriggerStatement.mutateAsync({
        projectUUID: projectId,
        triggerStatementPayload: payload,
      });
    } catch (e) {
      console.error('Create Manual Trigger Error::', e);
    } finally {
      form.reset();
    }
  };

  const handleNext = () => {
    if (form.formState.isValid) {
      next()
    } else return
  }

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
            {/* <FormField
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
            /> */}
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
            {/* <FormField
              control={form.control}
              name="activity"
              render={({ field }) => {
                return (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      // defaultValue={field.value}
                    >
                      <FormLabel>Activity</FormLabel>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Activity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <Link
                            href={`/projects/aa/${projectID}/activities/add`}
                          >
                            <SelectLabel className="text-primary flex items-center gap-1 p-2 bg-secondary">
                              Add new activity <Plus size={18} />
                            </SelectLabel>
                          </Link>
                          {activities.map((item: any) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="activity"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0 mx-1 my-2"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.some(
                                          (value) => value.uuid === item.uuid,
                                        )}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                {
                                                  uuid: item.uuid,
                                                  title: item.title,
                                                },
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) =>
                                                    value.uuid !== item.uuid,
                                                ),
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {item.title}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.watch('activity').map((activity) => {
                        const truncatedTitle =
                          activity.title.length > 50
                            ? activity.title.slice(0, 49) + '...'
                            : activity.title;
                        return (
                          <div
                            key={activity.uuid}
                            className="px-2 py-1 flex gap-2 items-center bg-secondary rounded"
                          >
                            <p className="text-primary">{truncatedTitle}</p>
                            <X
                              className="cursor-pointer hover:text-red-500 ml-4"
                              onClick={() => {
                                const updatedValue = field.value?.filter(
                                  (value) => value.uuid !== activity.uuid,
                                );
                                field.onChange(updatedValue);
                              }}
                              size={18}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            /> */}
            {/* <FormField
              control={form.control}
              name="notes"
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter Trigger Notes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            /> */}
          </div>
          <div className="flex justify-end mt-8">
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="bg-red-100 text-red-600 w-36"
                disabled
              >
                Cancel
              </Button>
              <Button className='px-8' onClick={handleNext}>Next</Button>
            </div>
          </div>
          {/* <div className="flex justify-end mt-8">
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
          </div> */}
        </form>
      </Form>
    </>
  );
}

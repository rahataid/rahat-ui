import * as React from 'react'
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
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Plus } from 'lucide-react';
import {
  useActivitiesStore,
  useCreateActivities,
  useStakeholdersGroups
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import AddCommunicationForm from './add.communication.form';

export default function AddActivities() {
  const createActivity = useCreateActivities();
  const { id: projectID } = useParams();
  const { categories, phases, hazardTypes } = useActivitiesStore((state) => ({
    categories: state.categories,
    phases: state.phases,
    hazardTypes: state.hazardTypes
  }))
  const [communicationAddForm, setCommunicationAddForm] = React.useState<{ id: number; form: React.ReactNode }[]>([]);
  const nextId = React.useRef(0);

  useStakeholdersGroups(projectID as UUID, {})

  const FormSchema = z.object({
    title: z.string().min(2, { message: 'Title must be at least 4 character' }),
    responsibility: z.string().min(2, { message: 'Please enter responsibility' }),
    source: z.string().min(2, { message: 'Please enter source' }),
    phaseId: z.string().min(1, { message: 'Please select phase' }),
    categoryId: z.string().min(1, { message: 'Please select category' }),
    hazardTypeId: z.string().min(1, { message: 'Please select hazard type' }),
    leadTime: z.string().min(2, { message: "Please enter lead time" }),
    description: z.string().min(5, { message: 'Must be at least 5 characters' }),
    activityCommunication: z.array(z.object({
      groupType: z.string().min(1, { message: 'Please select group type' }),
      groupId: z.string().min(1, { message: 'Please select group' }),
      communicationType: z.string().min(1, { message: 'Please select communication type' }),
      message: z.string().min(5, { message: 'Must be at least 5 characters' })
    }))
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      responsibility: '',
      source: '',
      phaseId: '',
      categoryId: '',
      hazardTypeId: '',
      leadTime: '',
      description: '',
      activityCommunication: [{ groupType: '', groupId: '', communicationType: '', message: '' }]
    },
  });

  const removeCommunicationForm = (idToRemove: number) => {
    setCommunicationAddForm(prevForms => prevForms.filter(({ id }) => id !== idToRemove));
  };

  const addCommunicationForm = () => {
    const newId = nextId.current++;
    setCommunicationAddForm(prevForms => [...prevForms, { id: newId, form: <AddCommunicationForm key={newId} form={form} index={newId} onClose={() => removeCommunicationForm(newId)} /> }]);
  }

  const handleCreateActivities = async (data: z.infer<typeof FormSchema>) => {
    try {
      await createActivity.mutateAsync({
        projectUUID: projectID as UUID,
        activityPayload: data,
      });
    } catch (e) {
      console.error('Error::', e);
    } finally {
      form.reset();
      setCommunicationAddForm([]);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateActivities)}>
        <div className='p-2 bg-secondary'>
          <ScrollArea className='h-[calc(100vh-80px)]'>
            <div className="p-4 rounded bg-card">
              <h1 className="text-lg font-semibold mb-6">Add : Activities</h1>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => {
                    return (
                      <FormItem className='col-span-2'>
                        <FormLabel>Activity title</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter activity title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="responsibility"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Responsibility</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter responsibility"
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
                  name="source"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Source</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter source" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="phaseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phase</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select phase" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {phases.map((item) => (
                            <SelectItem key={item.id} value={item.uuid}>
                              {item.name}
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
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((item) => (
                            <SelectItem key={item.id} value={item.uuid}>
                              {item.name}
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
                  name="hazardTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hazard Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select hazard type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {hazardTypes.map((item) => (
                            <SelectItem key={item.id} value={item.uuid}>
                              {item.name}
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
                  name="leadTime"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Lead Time</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter lead time" {...field} />
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
                      <FormItem className='col-span-2'>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              {communicationAddForm?.map(({ id, form }) => (
                <div key={id} className='mt-4'>{form}</div>
              ))}
              <Button
                type='button'
                variant='outline'
                className='border-dashed border-primary text-primary text-md w-full mt-4'
                onClick={addCommunicationForm}
              >
                Add Communication
                <Plus className='ml-2' size={16} strokeWidth={3} />
              </Button>
              <Button type='button' variant='outline' className='border-dashed border-primary text-primary text-md w-full mt-4'>
                Add Payout
                <Plus className='ml-2' size={16} strokeWidth={3} />
              </Button>
              <div className="flex justify-end mt-8">
                <div className='flex gap-2'>
                  <Button
                    type='button'
                    variant='secondary'
                    className='bg-red-100 text-red-600 w-36'
                    onClick={() => {
                      form.reset();
                      setCommunicationAddForm([])
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type='submit'>Create Activities</Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </form>
    </Form>
  );
}

'use client';

import { useParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@rahat-ui/shadcn/src/components/ui/select';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  useCreateActivityCommunication,
  useStakeholdersGroups,
  useStakeholdersGroupsStore,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';

const commType = [
  {
    id: '1',
    uuid: '123',
    name: 'Email',
  },
  {
    id: '2',
    uuid: '456',
    name: 'SMS',
  },
];

type IProps = {
  activityId: number;
};

export default function ActivityCommunicationForm({ activityId }: IProps) {
  const { id } = useParams();
  useStakeholdersGroups(id as UUID, {});
  const stakeholdersGroups = useStakeholdersGroupsStore(
    (state) => state.stakeholdersGroups,
  );
  const createActivityCommunication = useCreateActivityCommunication();

  const FormSchema = z.object({
    group: z.string().min(1, { message: 'Please select group' }),
    communicationType: z
      .string()
      .min(1, { message: 'Please select communication type' }),
    message: z.string().min(5, { message: 'Must be at least 5 characters' }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      group: '',
      communicationType: '',
      message: '',
    },
  });

  const handleCreateCommunication = async (
    data: z.infer<typeof FormSchema>,
  ) => {
    createActivityCommunication.mutateAsync({
      projectUUID: id as UUID,
      activityCommunicationPayload: { ...data, activityId },
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateCommunication)}>
        <div className="flex flex-col gap-2 m-2 p-2 border rounded">
          <h1 className="p-2 font-semibold text-lg bg-secondary">
            Add: Activity Communication
          </h1>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <FormField
              control={form.control}
              name="group"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {stakeholdersGroups.map((item: any) => (
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
              name="communicationType"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select communication" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {commType.map((item) => (
                        <SelectItem key={item.id} value={item.name}>
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
              name="message"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="Message" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="flex justify-end">
            <Button>Submit</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
